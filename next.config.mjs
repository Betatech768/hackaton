/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile these packages so they work correctly in the App Router/SSR environment
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/xr",
  ],
  // Recommended for R3F projects to handle heavy math/physics assets
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
