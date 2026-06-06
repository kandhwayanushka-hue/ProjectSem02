import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'//tailwind v4 plugin for Vite

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
