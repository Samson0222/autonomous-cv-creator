import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const nodeModules = resolve(import.meta.dirname, "node_modules")

export default defineConfig({
  root: resolve(import.meta.dirname, "../.."),
  cacheDir: resolve(import.meta.dirname, "node_modules/.vite"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      "@fixtures": resolve(import.meta.dirname, "../../fixtures/shared"),
      "@testing-library/jest-dom": resolve(
        nodeModules,
        "@testing-library/jest-dom"
      ),
      "@testing-library/react": resolve(nodeModules, "@testing-library/react"),
      "@testing-library/user-event": resolve(
        nodeModules,
        "@testing-library/user-event"
      ),
      react: resolve(nodeModules, "react"),
      "react-dom": resolve(nodeModules, "react-dom"),
      "react-router-dom": resolve(nodeModules, "react-router-dom"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["tests/frontend/setup.ts"],
    include: ["tests/frontend/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    fsModuleCachePath: resolve(
      import.meta.dirname,
      "node_modules/.vitest-cache"
    ),
  },
})
