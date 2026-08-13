import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://harshilkikani.github.io',
  base: '/north-houston-demos/la-tino-hair',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: { plugins: [tailwind()] },
})
