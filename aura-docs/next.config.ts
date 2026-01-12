import type { NextConfig } from "next";
import { withNextra } from "nextra";

const withNextraConfig = withNextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextraConfig(nextConfig);
