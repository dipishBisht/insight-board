import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteStaticCopy({
    targets: [
      {
        src: 'public/manifest.json',
        dest: '.'
      }
    ]
  }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        background: './src/background.ts'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        format: 'es'
      }
    },
    target: 'esnext'
  }
})
