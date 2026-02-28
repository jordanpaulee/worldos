/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@worldos/connectors",
    "@worldos/core-schema",
    "@worldos/source-registry"
  ]
};

export default nextConfig;
