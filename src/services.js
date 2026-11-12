// Where the app shell finds its three sibling services. Same host by default; set the
// VITE_*_URL variables at build time to point at separately deployed hosts (CORS must allow it).
const env = import.meta.env
export const CONTENT_URL = env.VITE_CONTENT_URL || '/content'
export const VOICE_URL = env.VITE_VOICE_URL || '/voice'
export const SPARKY_URL = env.VITE_SPARKY_URL || '/sparky'
