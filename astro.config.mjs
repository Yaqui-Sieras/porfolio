// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import path from "node:path";

// Extracción limpia de datos del repositorio de GitHub Pages
const ghRepository = process.env.GITHUB_REPOSITORY;
const [ghOwner, ghRepoName] = ghRepository ? ghRepository.split("/") : [];

// Flags de entorno unificados para todas las plataformas CI/CD soportadas
const isDev = process.env.NODE_ENV === "development";
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isVercel = process.env.VERCEL === "1";
const isNetlify = process.env.NETLIFY === "true";
const isCloudflare = process.env.CF_PAGES === "1";

/**
 * Determina dinámicamente la URL raíz (`site`) según la plataforma de despliegue activa.
 * @returns {string | undefined} URL absoluta del sitio o `undefined` en entorno de desarrollo.
 */
const getDeploymentSite = () => {
  // 1. Desarrollo local
  if (isDev) return;

  // 2. GitHub Pages
  if (isGitHubActions && ghOwner) {
    return `https://${ghOwner}.github.io`;
  }

  // 3. Vercel
  if (isVercel && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // 4. Netlify
  if (isNetlify && process.env.URL) {
    return process.env.URL;
  }

  // 5. Cloudflare Pages
  if (isCloudflare && process.env.CF_PAGES_URL) {
    return process.env.CF_PAGES_URL;
  }

  // Fallback para compilaciones de producción ejecutadas localmente
  const folderName = path.basename(process.cwd());
  return `https://${folderName}.vercel.app`;
};

/**
 * Determina la ruta base (`base`) de la aplicación.
 * Asigna una subcarpeta dinámicamente en GitHub Pages (`/nombre-repo/`) y la raíz (`/`) en el resto de plataformas.
 * @returns {string} Ruta base normalizada.
 */
const getDeploymentBase = () => {
  if (isGitHubActions && ghRepoName) {
    return `/${ghRepoName}/`;
  }

  return "/";
};

// https://astro.build/config
export default defineConfig({
  // URL absoluta dinámica según el proveedor de hosting
  site: getDeploymentSite(),

  // Ruta base adaptativa para GitHub Pages o raíz del dominio
  base: getDeploymentBase(),
  trailingSlash: "always",
  integrations: [sitemap()],
});
