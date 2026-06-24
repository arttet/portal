import adapterCloudflare from "@sveltejs/adapter-cloudflare";
import adapterStatic from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const OUTPUT_DIR = "target/build";

const adapter =
  process.env.BUILD_TARGET === "cf"
    ? adapterCloudflare()
    : adapterStatic({ pages: OUTPUT_DIR, assets: OUTPUT_DIR });

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
