"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNetworkMaterial, createEdgeMaterial } from "./shaders/NetworkMaterial";

// ─── Network topology ─────────────────────────────────────────────────────────

// Layer definitions for the NLP model visualization:
//   Layer 0 - Tokenizer output tokens  (input sequence)
//   Layer 1 - TF-IDF / word embedding  (feature extraction)
//   Layer 2 - Attention / hidden state (weighting)
//   Layer 3 - Output logits / probs    (classification head)

const LAYERS = [
  { count: 22, x: -3.8, label: "Tokenizer" },
  { count: 18, x: -1.3, label: "TF-IDF"    },
  { count: 14, x:  1.3, label: "Attention" },
  { count:  8, x:  3.8, label: "Output"    },
] as const;

const NETWORK_NODE_COUNT = LAYERS.reduce((s, l) => s + l.count, 0); // 62
const AMBIENT_NODE_COUNT = 938; // data-cloud scatter
const TOTAL_NODES = NETWORK_NODE_COUNT + AMBIENT_NODE_COUNT;        // 1000

// Y-spread per layer: nodes evenly distributed on the Y axis
const Y_SPREAD = 0.38; // world units between nodes in a layer

// Ambient cloud dimensions
const CLOUD_RADIUS  = 5.5;
const CLOUD_HEIGHT  = 4.0;

// Edge sparsity: each network node connects to this many nodes in the next layer
const EDGES_PER_NODE = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

// ─── Geometry builders ────────────────────────────────────────────────────────

interface NetworkGeometryData {
  positions:   Float32Array; // [x, y, z] per node, length = TOTAL_NODES * 3
  weights:     Float32Array; // aWeight per node,   length = TOTAL_NODES
  layerIndices:Float32Array; // aLayerIdx per node, length = TOTAL_NODES
  // Layer-node ranges: networkRanges[i] = { start, end } index into positions
  networkRanges: Array<{ start: number; end: number }>;
}

function buildNetworkData(): NetworkGeometryData {
  const positions    = new Float32Array(TOTAL_NODES * 3);
  const weights      = new Float32Array(TOTAL_NODES);
  const layerIndices = new Float32Array(TOTAL_NODES);
  const networkRanges: Array<{ start: number; end: number }> = [];

  let idx = 0;

  // ── Network nodes ──────────────────────────────────────────────
  LAYERS.forEach((layer, li) => {
    const start = idx;
    const halfH = ((layer.count - 1) * Y_SPREAD) / 2;

    for (let ni = 0; ni < layer.count; ni++) {
      const y  = -halfH + ni * Y_SPREAD;
      // Slight Z jitter creates a sense of depth per layer
      const z  = (seededRandom(li * 100 + ni) - 0.5) * 0.6;

      positions[idx * 3 + 0] = layer.x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      // ML weight: slight variation per node so some neurons appear "heavier"
      weights[idx]      = 0.35 + seededRandom(idx + 7) * 0.65;
      layerIndices[idx] = li;
      idx++;
    }
    networkRanges.push({ start, end: idx - 1 });
  });

  // ── Ambient data-cloud nodes ───────────────────────────────────
  // Distributed cylindrically around the network to represent the
  // high-dimensional feature space the NLP model operates in.
  for (let ai = 0; ai < AMBIENT_NODE_COUNT; ai++) {
    const angle  = seededRandom(ai * 3 + 0) * Math.PI * 2;
    const radius = CLOUD_RADIUS * (0.5 + seededRandom(ai * 3 + 1) * 0.5);
    const height = (seededRandom(ai * 3 + 2) - 0.5) * CLOUD_HEIGHT * 2;

    positions[idx * 3 + 0] = Math.cos(angle) * radius;
    positions[idx * 3 + 1] = height;
    positions[idx * 3 + 2] = Math.sin(angle) * radius;

    weights[idx]      = seededRandom(ai + 200) * 0.6;
    layerIndices[idx] = -1; // ambient
    idx++;
  }

  return { positions, weights, layerIndices, networkRanges };
}

function buildEdgeGeometry(
  networkData: NetworkGeometryData
): Float32Array {
  const { positions, networkRanges } = networkData;
  const lines: number[] = [];

  for (let li = 0; li < networkRanges.length - 1; li++) {
    const srcRange  = networkRanges[li];
    const dstRange  = networkRanges[li + 1];
    const dstLen    = dstRange.end - dstRange.start + 1;

    for (let si = srcRange.start; si <= srcRange.end; si++) {
      // Connect each source node to EDGES_PER_NODE destination nodes
      // chosen pseudo-randomly (stable per-node seed)
      for (let e = 0; e < EDGES_PER_NODE; e++) {
        const dstOffset = Math.floor(seededRandom(si * 17 + e * 31) * dstLen);
        const di        = dstRange.start + dstOffset;

        // Source vertex
        lines.push(positions[si * 3], positions[si * 3 + 1], positions[si * 3 + 2]);
        // Destination vertex
        lines.push(positions[di * 3], positions[di * 3 + 1], positions[di * 3 + 2]);
      }
    }
  }

  return new Float32Array(lines);
}

// ─── Shared scratch objects (avoid per-frame GC) ──────────────────────────────

const _matrix   = new THREE.Matrix4();
const _hoverVec = new THREE.Vector3(9999, 9999, 9999);
const _raycaster = new THREE.Raycaster();

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * NeuralNetwork
 *
 * Renders 1000 nodes as a single THREE.InstancedMesh (1 draw call) using
 * a custom ShaderMaterial that visualizes:
 *   - NLP tokenizer layers (input -> TF-IDF -> attention -> output)
 *   - ML weight magnitudes (node size / brightness)
 *   - Pointer hover: nodes repel from the cursor in world space
 *
 * Memory discipline:
 *   All THREE objects (geometries, materials) are created once in useEffect,
 *   stored in refs, and explicitly .dispose()-d on unmount.
 */
export function NeuralNetwork() {
  // ── Refs to THREE objects that need explicit disposal ──────────
  const meshRef        = useRef<THREE.InstancedMesh | null>(null);
  const edgesRef       = useRef<THREE.LineSegments | null>(null);
  const nodeGeoRef     = useRef<THREE.SphereGeometry | null>(null);
  const edgeGeoRef     = useRef<THREE.BufferGeometry | null>(null);
  const matRef         = useRef<THREE.ShaderMaterial | null>(null);
  const edgeMatRef     = useRef<THREE.LineBasicMaterial | null>(null);

  // ── Scene group ref so we can add/remove children cleanly ─────
  const groupRef       = useRef<THREE.Group | null>(null);

  // ── Hover tracking ─────────────────────────────────────────────
  const hoverPosRef    = useRef<THREE.Vector3>(_hoverVec.clone());
  const isHoveredRef   = useRef(false);

  // ── R3F context ───────────────────────────────────────────────
  const { size, scene, camera, gl } = useThree();

  // ── Build + mount geometry on first render ────────────────────
  useEffect(() => {
    if (!groupRef.current) return;

    // ── Build node data ────────────────────────────────────────
    const data       = buildNetworkData();
    const edgeVerts  = buildEdgeGeometry(data);

    // ── Node geometry: a low-poly sphere ─────────────────────
    // widthSegments=6, heightSegments=4 -> 24 triangles per instance
    // Small enough to keep vertex bandwidth low; the shader draws
    // a circular disc anyway so extra geometry is wasted.
    const nodeGeo = new THREE.SphereGeometry(0.06, 6, 4);
    nodeGeoRef.current = nodeGeo;

    // Attach per-instance attributes
    nodeGeo.setAttribute(
      "aWeight",
      new THREE.InstancedBufferAttribute(data.weights, 1)
    );
    nodeGeo.setAttribute(
      "aLayerIdx",
      new THREE.InstancedBufferAttribute(data.layerIndices, 1)
    );

    // ── Node material ─────────────────────────────────────────
    const mat = createNetworkMaterial();
    matRef.current = mat;

    // ── InstancedMesh: exactly 1 draw call for all 1000 nodes ─
    const mesh = new THREE.InstancedMesh(nodeGeo, mat, TOTAL_NODES);
    mesh.frustumCulled = false; // scene wraps canvas; always draw
    meshRef.current = mesh;

    // Set instance transformation matrices (translation only)
    for (let i = 0; i < TOTAL_NODES; i++) {
      _matrix.makeTranslation(
        data.positions[i * 3],
        data.positions[i * 3 + 1],
        data.positions[i * 3 + 2]
      );
      mesh.setMatrixAt(i, _matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // ── Edge geometry ─────────────────────────────────────────
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(edgeVerts, 3)
    );
    edgeGeoRef.current = edgeGeo;

    const edgeMat = createEdgeMaterial();
    edgeMatRef.current = edgeMat;

    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.frustumCulled = false;
    edgesRef.current = edges;

    // ── Mount into scene group ─────────────────────────────────
    groupRef.current.add(edges, mesh);

    // ── Cleanup: dispose all THREE resources on unmount ────────
    return () => {
      groupRef.current?.remove(mesh, edges);

      nodeGeo.dispose();
      mat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();

      meshRef.current     = null;
      edgesRef.current    = null;
      nodeGeoRef.current  = null;
      edgeGeoRef.current  = null;
      matRef.current      = null;
      edgeMatRef.current  = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once; geometry is static

  // ── Update uResolution when canvas is resized ─────────────────
  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height]);

  // ── Pointer hover handlers ────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: { point: THREE.Vector3 }) => {
      hoverPosRef.current.copy(e.point);
      isHoveredRef.current = true;
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    // Move hover pos far away; shader smoothstep will see 0 influence
    hoverPosRef.current.set(9999, 9999, 9999);
    isHoveredRef.current = false;
  }, []);

  // ── Per-frame update ──────────────────────────────────────────
  useFrame(({ clock }) => {
    const mat = matRef.current;
    if (!mat) return;

    // Update time uniform
    mat.uniforms.uTime.value = clock.elapsedTime;

    // Push hover position into shader every frame
    mat.uniforms.uHoverPos.value.copy(hoverPosRef.current);
  });

  // ── Render: invisible mesh to capture pointer events ──────────
  // The invisible mesh intercepts pointer events over the whole scene
  // volume and feeds world-space intersection points to the handlers.
  return (
    <group ref={groupRef}>
      {/*
        Transparent pointer-capture plane that covers the full viewport depth.
        onPointerMove / onPointerLeave forwarded to the shader via refs.
      */}
      <mesh
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        visible={false}
      >
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
