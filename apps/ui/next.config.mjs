import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
const nextConfig = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  transpilePackages: [
    "@chrona/connectors",
    "@chrona/core-schema",
    "@chrona/source-registry"
  ],
  experimental: {
    devtoolSegmentExplorer: false
  }
});

export default nextConfig;
