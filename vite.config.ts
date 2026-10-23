import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const SOCKET_CLIENT_MODULES = /node_modules[\\/](socket\.io-client|engine\.io-client)[\\/]/
const SOCKET_PROTOCOL_MODULES =
  /node_modules[\\/](socket\.io-parser|engine\.io-parser|@socket\.io[\\/]component-emitter)[\\/]/

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/app/router/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'socket-protocol', test: SOCKET_PROTOCOL_MODULES, priority: 2 },
            { name: 'socket-client', test: SOCKET_CLIENT_MODULES, priority: 1 },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
