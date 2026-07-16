import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Point Tailwind at this template's config explicitly so it works regardless of
// the process cwd (e.g. when Vite is launched with an explicit root).
export default {
  plugins: {
    tailwindcss: { config: path.join(__dirname, "tailwind.config.js") },
    autoprefixer: {},
  },
}
