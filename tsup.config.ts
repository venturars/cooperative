/// <reference types="node" />
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  target: "es2022",
  outDir: "dist",
  splitting: false,
  treeshake: true,
  // Configuración para mejor compatibilidad con Vite
  esbuildOptions(options) {
    // Forzar resolución de imports
    options.bundle = true;
    options.platform = 'neutral';
  },
  env: {
    COOPERATIVE_API_BASE_URL: process.env.COOPERATIVE_API_BASE_URL!,
  },
});
