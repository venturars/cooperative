/// <reference types="node" />
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  target: "es2022",
  outDir: "dist",
  splitting: false,
  treeshake: true,
  env: {
    COOPERATIVE_API_BASE_URL: process.env.COOPERATIVE_API_BASE_URL!,
  },
});
