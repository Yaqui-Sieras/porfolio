// src/constants/routest.ts

/**
 * Normaliza cualquier ruta o URL garantizando siempre una barra final ('/').
 */
function ensureTrailingSlash(url: string): string {
  if (!url) return '/';
  return url.endsWith('/') ? url : `${url}/`;
}

export const BASE_URL = ensureTrailingSlash(import.meta.env.BASE_URL);
// Dominio raíz en producción (ej. https://yaqui-sieras.github.io/)
// En desarrollo local usa un fallback al dominio base de GitHub Pages.
export const SITE_URL = ensureTrailingSlash(
  import.meta.env.SITE || 'https://yaqui-sieras.github.io/',
);

/**
 * Determina si una URL o ruta dada apunta fuera del dominio de la aplicación.
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;

  try {
    const targetOrigin = new URL(url).origin;
    const siteOrigin = new URL(SITE_URL).origin;
    return targetOrigin !== siteOrigin;
  } catch {
    return false;
  }
}

export interface BuildUrlOptions {
  useAbsolute?: boolean;
  isExternal?: boolean;
}

/**
 * Helper para construir URLs absolutas para repositorios externos o rutas locales de desarrollo.
 * @param path Ruta relativa, ej: "proyectos/"
 * @param absoluteSiEsPosible Si es true genera la URL completa.
 */
export function buildUrl(path: string, options: BuildUrlOptions = {}): string {
  const { useAbsolute = false } = options;

  if (isExternalUrl(path)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

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
  HOME: buildUrl('/', { useAbsolute: false }),
  PORFOLIO: buildUrl('porfolio/', { useAbsolute: true }),
  PROYECTS: buildUrl('proyectos/', { useAbsolute: false }),
  CONTACT: buildUrl('contacto/', { useAbsolute: false }),
  GITHUB_PROFILE: buildUrl('https://github.com/yaqui-sieras/'),
} as const;

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  target?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Inicio', href: ROUTES.HOME, icon: '🏯' },
  { label: 'Porfolio', href: ROUTES.PORFOLIO, icon: '💼', target: '_blank' },
  { label: 'Proyectos', href: ROUTES.PROYECTS, icon: '💻' },
  { label: 'Contacto', href: ROUTES.CONTACT, icon: '📩' },
  { label: 'GitHub', href: ROUTES.GITHUB_PROFILE, icon: '🐈‍⬛' },
] as const;

export const LEGAL_LINKS = [
  { label: 'Licencia MIT', href: buildUrl('LICENSE') },
  { label: 'Términos y Condiciones', href: buildUrl('terminos-condiciones/') },
  { label: 'Privacidad', href: buildUrl('privacidad/') },
] as const;

export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
  target?: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/yaqui-sieras' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/yaqui-sieras-vr' },
  { name: 'Email', url: 'mailto:tu-email@ejemplo.com', target: '_self' },
] as const;
