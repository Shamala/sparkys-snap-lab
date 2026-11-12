// Where the app shell finds its three sibling services. Same host by default; set the
// VITE_*_URL variables at build time to point at separately deployed hosts (CORS must allow it).
const env = import.meta.env
const base = env.BASE_URL // '/' locally, '/<repo>/' on GitHub Pages
export const CONTENT_URL = env.VITE_CONTENT_URL || `${base}content`
export const VOICE_URL = env.VITE_VOICE_URL || `${base}voice`
export const SPARKY_URL = env.VITE_SPARKY_URL || `${base}sparky`
export const PARTS_URL = `${base}parts` // piece pictures (public/parts)
