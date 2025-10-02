import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/validation-form/',
  build: {
    outDir: 'dist',
  }
})