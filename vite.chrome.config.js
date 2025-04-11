import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.chrome";
import viteConfig from "./vite.config";

viteConfig.plugins?.push(crx({ manifest }));

export default viteConfig;
