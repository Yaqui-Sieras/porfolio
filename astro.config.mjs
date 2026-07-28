// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// GitHub Actions define automáticamente la variable GITHUB_ACTIONS
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

// https://astro.build/config
export default defineConfig({
  // URL completa de tu sitio de GitHub Pages o el que uses
  site: isGitHubActions
    ? "https://Yaqui-Sieras.github.io"
    : "https://Yaqui-Sieras.vercel.app",

  // Nombre del repositorio (solo si NO es un repositorio de tipo usuario/organización principal)
  // Si se está compilando en GitHub Actions usa la subcarpeta,
  // si es en Vercel, Netlify o en local (npm run dev), usa la raíz '/'
  base: isGitHubActions ? "/Porfolio/" : "/",

  integrations: [sitemap()],
});
