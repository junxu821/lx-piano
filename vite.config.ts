import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'/xu-piano/',
  resolve: {
    // 配置路径别名
    alias: {
      '@': '/src'
    }
  },
})
