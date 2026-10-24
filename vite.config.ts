import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  build: { manifest: true, chunkSizeWarningLimit: 800, rolldownOptions: { output: { codeSplitting: { groups: [{ name: 'three', test: /node_modules[\\/]three/ }] } } } },
})
