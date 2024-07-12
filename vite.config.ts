import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as url from 'url'
import path from 'path'

const dirName = url.fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      Assets: path.resolve(dirName, 'src/assets'),
      Components: path.resolve(dirName, 'src/components'),
      Consts: path.resolve(dirName, 'src/consts'),
      Services: path.resolve(dirName, 'src/services'),
      Hooks: path.resolve(dirName, 'src/hooks'),
    },
  },
})
