import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
const nextConfig = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  transpilePackages: [
    "@worldos/connectors",
    "@worldos/core-schema",
    "@worldos/source-registry"
  ],
  experimental: {
    devtoolSegmentExplorer: false
  }
});

export default nextConfig;
