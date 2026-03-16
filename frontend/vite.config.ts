import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const envDir = resolve(__dirname, '..')
  const env = loadEnv(mode, envDir, '')
  const backendPort = env.NURTURA_SERVER_PORT || '18080'
  const backendOrigin = env.NURTURA_BACKEND_ORIGIN || `http://localhost:${backendPort}`

  return {
    envDir,
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
