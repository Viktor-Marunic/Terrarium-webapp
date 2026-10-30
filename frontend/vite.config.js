import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /Terrarium-webapp/ (the repo name), not the domain root, so production
  // builds prefix every asset URL with it. `npm run dev` keeps serving from / (http://localhost:5173).
  base: command === 'build' ? '/Terrarium-webapp/' : '/',
  plugins: [react(), tailwindcss()],
}))
