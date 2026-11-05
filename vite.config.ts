import { defineConfig } from "vite";
import prefresh from "@prefresh/vite";

export default defineConfig({
  plugins: [await prefresh()],
  oxc: { jsx: { runtime: "automatic", importSource: "preact" } },
  build: { minify: "oxc" },
  resolve: {
    alias: {
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
      "react/jsx-dev-runtime": "preact/jsx-dev-runtime",
      react: "preact/compat",
    },
  },
});
