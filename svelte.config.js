import adapterStatic from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const OUTPUT_DIR = "target/build";

const adapter = adapterStatic({ pages: OUTPUT_DIR, assets: OUTPUT_DIR, fallback: "200.html" });

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: true,
  },
  preprocess: vitePreprocess(),
  kit: {
    adapter,
  },
};

export default config;
