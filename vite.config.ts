import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // SSR(프리렌더) 번들에서 CommonJS 패키지를 함께 번들링해 named export 호환 처리
  ssr: {
    noExternal: ['react-helmet-async'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
