import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import sirv from 'sirv'

// Dev only: serve the three sibling services (services/<name>/...) at /<name>/... so the app shell
// finds them at the same paths a single-host deploy uses. Production serves them from wherever
// VITE_CONTENT_URL, VITE_VOICE_URL and VITE_SPARKY_URL point (see BUILDING.md).
const serveServices = () => ({
  name: 'serve-services',
  configureServer(server) {
    const files = sirv('services', { dev: true })
    server.middlewares.use((req, res, next) => (/^\/(content|voice|sparky)\//.test(req.url) ? files(req, res, next) : next()))
  },
})

export default defineConfig({
  plugins: [
    react(),
    serveServices(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        // Services are fetched at runtime and refreshed in the background, so a content, voice or
        // artwork deploy reaches installed apps without an app-shell release.
        runtimeCaching: [{
          urlPattern: /\/(content|voice|sparky)\//,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'services', expiration: { maxEntries: 400 } },
        }],
      },
      manifest: {
        name: "Sparky's Snap Lab",
        short_name: 'Snap Lab',
        description: "Follow-along snap circuit projects for kids, with Sparky the dog",
        theme_color: '#ffb703',
        background_color: '#fffbea',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
