import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./ORGINAL/**/*', './EquityVault/**/*'],
  },
};

export default nextConfig;
