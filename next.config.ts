import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Three.js ecosystem packages (ESM)
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/rapier",
    "r3f-perf",
    "leva",
  ],

  // Disable source maps in development to work around Turbopack UTF-8 source
  // map generation panic (known bug in Next.js 16 Turbopack with three.js)
  productionBrowserSourceMaps: false,

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  turbopack: {
    // Treat .glsl, .glb, .hdri as raw assets to prevent Turbopack
    // from trying to parse binary/non-UTF8 content as JS source maps
    rules: {
      "*.glsl": { loaders: ["raw-loader"], as: "*.js" },
    },
  },
};

export default nextConfig;
