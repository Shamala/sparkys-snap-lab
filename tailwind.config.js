import preset from '@shamallya-ui/tokens/tailwind'
import shamallya from './tailwind.shamallya.ts'

// ShaMallya setup: tokens preset first, then the components' additions (registry item "shamallya-theme").
export default {
  presets: [preset, shamallya],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  future: { hoverOnlyWhenSupported: true },
}
