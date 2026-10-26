import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vue 编译与静态资源打包。
export default defineConfig({
  plugins: [vue()],
  // three 单独分包缓存，体积告警线放宽到 800 KB。
  build: {
    manifest: true,
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/]three/ },
            // 整件珠串的模型与界面入口分开缓存。
            {
              name: 'bead-projects',
              test: /src[\\/]lessons[\\/](?:beadProjectGeometry|beading-(?:wire|frame|pendant|loop)-projects)\.ts$/,
            },
            // 新增编织模型独立缓存，避免课程数据继续挤大界面入口。
            {
              name: 'weaving-models',
              test: /src[\\/]lessons[\\/]weaving(?:-netting|-jewelry-braids|-patterns|Geometry)\.ts$/,
            },
          ],
        },
      },
    },
  },
});
