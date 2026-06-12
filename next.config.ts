import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/**/*': ['./ORGINAL/**/*', './EquityVault/**/*'],
  },
};

export default nextConfig;
