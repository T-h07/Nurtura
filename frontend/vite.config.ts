import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveDevBackendOrigin } from './config/devBackendOrigin'

export default defineConfig(({ mode }) => {
  const envDir = resolve(__dirname, '..')
  const backend = resolveDevBackendOrigin(mode, envDir)

  console.info(
    `[nurtura] frontend dev proxy /api -> ${backend.origin} (NURTURA_BACKEND_HOST=${backend.host}, NURTURA_SERVER_PORT=${backend.port})`,
  )

  return {
    envDir,
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backend.origin,
          changeOrigin: true,
        },
      },
    },
  }
})
