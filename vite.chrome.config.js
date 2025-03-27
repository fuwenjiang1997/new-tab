
import { crx } from '@crxjs/vite-plugin'
import viteConfig from './vite.config'
import manifest from './manifest.chrome'

viteConfig.plugins?.push(crx({ manifest: manifest }))

export default viteConfig