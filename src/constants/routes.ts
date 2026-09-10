// src/constants/routest.ts

/**
 * Normaliza cualquier ruta o URL garantizando siempre una barra final ('/').
 */
function ensureTrailingSlash(url: string): string {
  if (!url) return "/";
  return url.endsWith("/") ? url : `${url}/`;
}

export const BASE_URL = ensureTrailingSlash(import.meta.env.BASE_URL);
// Dominio raíz en producción (ej. https://yaqui-sieras.github.io/)
// En desarrollo local usa un fallback al dominio base de GitHub Pages.
export const SITE_URL = ensureTrailingSlash(
  import.meta.env.SITE || "https://yaqui-sieras.github.io/",
);

export interface BuildUrlOptions {
  useAbsolute?: boolean;
  isExternal?: boolean;
}

/**
 * Helper para construir URLs absolutas para repositorios externos o rutas locales de desarrollo.
 * @param path Ruta relativa, ej: "proyectos/"
 * @param absoluteSiEsPosible Si es true genera la URL completa.
 * @param isExternal Si es true, la URL se considera externa y no se aplica el prefijo.
 */
export function buildUrl(path: string, options: BuildUrlOptions = {}): string {
  const { useAbsolute = false, isExternal = false } = options;

  if (isExternal || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (import.meta.env.DEV && useAbsolute) {
    return `${BASE_URL}#${cleanPath}`;
  }

  const prefix = useAbsolute ? SITE_URL : BASE_URL;

  return `${prefix}${cleanPath}`;
}

/**
 * Diccionario de secciones base del proyecto.
 */
export const ROUTES = {
  HOME: buildUrl("/", { useAbsolute: true }),
  PORFOLIO: buildUrl("/", { useAbsolute: false }),
  PROYECTS: buildUrl("proyectos/", { useAbsolute: false }),
  CONTACT: buildUrl("contacto/", { useAbsolute: true }),
  GITHUB_PROFILE: buildUrl("https://github.com/yaqui-sieras/", {
    isExternal: true,
  }),
} as const;

export interface NavItem {
  label: string;
  href: string;
  target?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Inicio", href: ROUTES.HOME },
  { label: "Porfolio", href: ROUTES.PORFOLIO },
  { label: "Proyectos", href: ROUTES.PROYECTS },
  { label: "Contacto", href: ROUTES.CONTACT },
  { label: "GitHub", href: ROUTES.GITHUB_PROFILE, target: "_blank" },
] as const;
