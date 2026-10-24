import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const SOCKET_CLIENT_MODULES = /node_modules[\\/](socket\.io-client|engine\.io-client)[\\/]/
const SOCKET_PROTOCOL_MODULES =
  /node_modules[\\/](socket\.io-parser|engine\.io-parser|@socket\.io[\\/]component-emitter)[\\/]/
const VENDOR_MODULES =
  /node_modules[\\/](react|react-dom|scheduler|@tanstack|radix-ui|@radix-ui|axios|sonner|zod|react-hook-form|@hookform|lucide-react|class-variance-authority|clsx|tailwind-merge|@floating-ui|use-sync-external-store)[\\/]/

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
            { name: 'socket-protocol', test: SOCKET_PROTOCOL_MODULES, priority: 3 },
            { name: 'socket-client', test: SOCKET_CLIENT_MODULES, priority: 2 },
            { name: 'vendor', test: VENDOR_MODULES, priority: 1 },
            { name: 'app', test: /[\\/]src[\\/](shared[\\/](?!mocks)|entities)[\\/]/, priority: 0 },
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
