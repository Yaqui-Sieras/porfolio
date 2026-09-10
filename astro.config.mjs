// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import path from "node:path";

const folderName = path.basename(process.cwd());

// Variables de entorno de plataformas CI/CD y Desarrollo
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isVercel = process.env.VERCEL === "1";
const isDev = process.env.NODE_ENV === "development";

const getSite = () => {
  if (isDev) return;

  if (isGitHubActions && process.env.GITHUB_REPOSITORY) {
    const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
    return `https://${owner}.github.io`;
  }
  if (isVercel && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Fallback por si compilas localmente para producción (astro build)
  return `https://${folderName}.vercel.app`;
};

// https://astro.build/config
export default defineConfig({
  // URL completa de tu sitio de GitHub Pages o el que uses
  site: getSite(),

  // En GH Actions usa la subcarpeta automáticamente, en los demás casos la raíz '/'
  base: isGitHubActions ? `/${folderName}/` : "/",
  trailingSlash: "always",
  integrations: [sitemap()],
});
