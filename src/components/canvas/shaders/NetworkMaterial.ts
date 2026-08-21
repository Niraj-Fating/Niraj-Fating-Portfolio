import * as THREE from "three";

// ─── Vertex Shader ────────────────────────────────────────────────────────────
//
// Represents NLP tokenizer data flow:
//   - Each instance is a "node" (token, TF-IDF feature, or weight neuron)
//   - aWeight  : ML weight magnitude [0..1] — controls pulse intensity + brightness
//   - aLayerIdx: Network layer [0..3] or -1 for ambient data cloud particles
//
// Transform chain:
//   local pos -> scale by pulse -> apply instanceMatrix (translation) -> hover push
//   -> viewMatrix -> projectionMatrix
//
const vertexShader = /* glsl */`
precision highp float;

// ── Custom uniforms ───────────────────────────────────────────────
uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uHoverPos;
uniform float uHoverRadius;
uniform float uHoverStrength;

// ── Custom per-instance attributes ───────────────────────────────
attribute float aWeight;    // TF-IDF / ML weight magnitude [0..1]
attribute float aLayerIdx;  // Network layer [0..3]; -1 = ambient cloud

// ── Varyings ──────────────────────────────────────────────────────
varying vec2  vUv;
varying float vWeight;
varying float vLayerIdx;
varying float vHoverInfluence;
varying float vActivation;

void main() {
  vUv        = uv;
  vWeight    = aWeight;
  vLayerIdx  = aLayerIdx;

  // ── Instance world-space centre ─────────────────────────────────
  // Column 3 of instanceMatrix = translation component
  vec3 instanceCentre = vec3(
    instanceMatrix[3][0],
    instanceMatrix[3][1],
    instanceMatrix[3][2]
  );

  // ── Hover influence ─────────────────────────────────────────────
  // Smooth radial falloff from the pointer 3D position
  float distToHover = length(instanceCentre - uHoverPos);
  float influence   = 1.0 - smoothstep(0.0, uHoverRadius, distToHover);
  vHoverInfluence   = influence;

  // ── Hover push: repel node away from the pointer ─────────────────
  vec3 pushDir      = normalize(instanceCentre - uHoverPos + vec3(0.001));
  vec3 hoverPush    = pushDir * influence * uHoverStrength;

  // ── Activation pulse ─────────────────────────────────────────────
  // Simulates a forward-propagation wave through NLP layers.
  // Network nodes (layerIdx >= 0) fire in sequence; ambient cloud
  // pulses softly on a slower independent rhythm.
  float layerPhase  = aLayerIdx >= 0.0 ? aLayerIdx * 0.5 : 0.0;
  float wavePhase   = mod(uTime * 0.7 + layerPhase, 6.2832);
  float activation  = 0.5 + 0.5 * sin(wavePhase + aWeight * 3.14159);
  vActivation       = activation;

  // ── Scale: base pulse + hover boost ──────────────────────────────
  float basePulse   = 1.0 + (0.08 + 0.10 * aWeight) * sin(uTime * 2.8 + layerPhase + aWeight * 6.28);
  float hoverScale  = 1.0 + influence * 0.55;
  float finalScale  = basePulse * hoverScale;

  // ── Build final world position ───────────────────────────────────
  // Scale vertex around instance centre, then translate by instance matrix,
  // then apply hover push on top.
  vec4 worldPos  = instanceMatrix * vec4(position * finalScale, 1.0);
  worldPos.xyz  += hoverPush;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────
//
// Renders each node as a glowing soft disc with:
//   - White-hot core  (innermost area)
//   - Layer-tinted inner glow  (reflects ML layer semantics)
//   - Dim outer halo  (additive blending gives bloom for free)
//   - Hover brightening
//
// Color mapping:
//   Layer 0 (Tokenizer input)    -> electric blue   #3399ff
//   Layer 1 (TF-IDF embedding)   -> indigo violet   #6633ff
//   Layer 2 (Attention / hidden) -> vivid purple    #aa22ee
//   Layer 3 (Output probs)       -> hot magenta     #ff2299
//   Ambient (data cloud)         -> cool blue-grey  #4477bb
//
const fragmentShader = /* glsl */`
precision highp float;

uniform float uTime;
uniform vec2  uResolution;

varying vec2  vUv;
varying float vWeight;
varying float vLayerIdx;
varying float vHoverInfluence;
varying float vActivation;

// ── Layer colour lookup ───────────────────────────────────────────
vec3 nodeColor(float layer, float weight, float activation) {
  vec3 c0 = vec3(0.20, 0.60, 1.00);  // Layer 0: tokenizer - blue
  vec3 c1 = vec3(0.40, 0.20, 1.00);  // Layer 1: embedding - indigo
  vec3 c2 = vec3(0.68, 0.13, 0.90);  // Layer 2: hidden    - purple
  vec3 c3 = vec3(1.00, 0.13, 0.55);  // Layer 3: output    - magenta
  vec3 ca = vec3(0.28, 0.45, 0.75);  // Ambient            - slate

  if (layer < 0.0) {
    return ca * (0.4 + 0.35 * weight + 0.25 * activation);
  }

  float t = clamp(layer / 3.0, 0.0, 1.0);
  vec3 base;
  if      (t < 0.333) { base = mix(c0, c1, t * 3.0); }
  else if (t < 0.666) { base = mix(c1, c2, (t - 0.333) * 3.0); }
  else                { base = mix(c2, c3, (t - 0.666) * 3.0); }

  // Weight drives brightness: high-weight neurons glow brighter
  float brightness = 0.45 + 0.35 * weight + 0.20 * activation;
  return base * brightness;
}

void main() {
  // ── Circular SDF: map uv from [0,1] to [-1,1] ────────────────
  vec2  uv   = vUv * 2.0 - 1.0;
  float dist = length(uv);

  // Hard clip outside the disc boundary
  if (dist > 1.0) discard;

  // ── Radial zones ─────────────────────────────────────────────
  // core  : 0.0 -> 0.35  (white-hot centre, always bright)
  // inner : 0.3 -> 0.65  (tinted layer colour, weight-driven)
  // outer : 0.6 -> 1.0   (dim halo for additive glow)
  float core  = 1.0 - smoothstep(0.00, 0.35, dist);
  float inner = 1.0 - smoothstep(0.30, 0.65, dist);
  float outer = 1.0 - smoothstep(0.60, 1.00, dist);

  vec3 layerCol  = nodeColor(vLayerIdx, vWeight, vActivation);
  vec3 hoverBoost = vec3(0.35, 0.25, 0.70) * vHoverInfluence;

  // ── Compose layers ────────────────────────────────────────────
  vec3 col = vec3(0.0);
  col += layerCol * outer  * 0.40;            // dim outer halo
  col += layerCol * inner  * 0.90;            // bright inner disc
  col += vec3(1.0) * core  * (0.70 + 0.30 * vWeight); // white core
  col += hoverBoost * inner;                  // hover tint

  col = clamp(col, 0.0, 2.0);                // allow slight HDR for additive

  // ── Alpha: outer envelope drives transparency ─────────────────
  // Low-weight ambient nodes are almost invisible; high-weight nodes
  // are solidly bright. Hover lifts any node to full visibility.
  float baseAlpha = (vLayerIdx >= 0.0)
    ? 0.50 + 0.40 * vWeight + 0.10 * vActivation
    : 0.18 + 0.20 * vWeight;
  float alpha = outer * (baseAlpha + 0.35 * vHoverInfluence);

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

// ─── Uniform types ────────────────────────────────────────────────────────────

export interface NetworkUniforms {
  [uniform: string]:  THREE.IUniform<unknown>; // index signature required by ShaderMaterial
  uTime:          THREE.IUniform<number>;
  uResolution:    THREE.IUniform<THREE.Vector2>;
  uHoverPos:      THREE.IUniform<THREE.Vector3>;
  uHoverRadius:   THREE.IUniform<number>;
  uHoverStrength: THREE.IUniform<number>;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * createNetworkMaterial
 *
 * Returns a THREE.ShaderMaterial representing NLP data-flow nodes.
 * The caller owns the object; call .dispose() on unmount.
 *
 * Uniforms:
 *   uTime          - elapsed time in seconds (update every frame)
 *   uResolution    - canvas pixel size (update on resize)
 *   uHoverPos      - pointer world-space position (far away when idle)
 *   uHoverRadius   - world-space repulsion radius
 *   uHoverStrength - max world-space push distance
 *
 * Per-instance attributes (set on the geometry):
 *   aWeight    (InstancedBufferAttribute, itemSize 1) - ML weight [0..1]
 *   aLayerIdx  (InstancedBufferAttribute, itemSize 1) - layer [0..3] or -1
 */
export function createNetworkMaterial(): THREE.ShaderMaterial {
  const uniforms: NetworkUniforms = {
    uTime:          { value: 0 },
    uResolution:    { value: new THREE.Vector2(1280, 720) },
    uHoverPos:      { value: new THREE.Vector3(9999, 9999, 9999) },
    uHoverRadius:   { value: 2.2 },
    uHoverStrength: { value: 0.45 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
    side:         THREE.FrontSide,
  });
}

// ─── Edge material ────────────────────────────────────────────────────────────

/**
 * createEdgeMaterial
 *
 * Thin LineBasicMaterial for the weight-edge connections between layers.
 * Additive blending makes high-density connection regions glow brighter.
 */
export function createEdgeMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color:      0x4455aa,
    transparent: true,
    opacity:     0.18,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  });
}
