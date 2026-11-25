import { portfolioConfig as defaultConfig } from '../portfolio.config';

const STORAGE_CONFIG_KEY = 'wf_custom_portfolio_config';

/**
 * Carga la configuración activa combinando los valores predeterminados
 * de portfolio.config.js con las modificaciones guardadas en localStorage.
 */
export function loadActiveConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (!raw) return defaultConfig;
    const custom = JSON.parse(raw);

    // Fusión recursiva segura
    return {
      personal: {
        ...defaultConfig.personal,
        ...(custom.personal || {})
      },
      github: {
        ...defaultConfig.github,
        ...(custom.github || {})
      },
      featuredProjects: mergeFeaturedProjects(defaultConfig.featuredProjects, custom.featuredProjects)
    };
  } catch (e) {
    console.error("Error al cargar configuración personalizada:", e);
    return defaultConfig;
  }
}

/**
 * Guarda las modificaciones realizadas en el panel administrativo en localStorage.
 */
export function saveActiveConfig(newConfig) {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(newConfig));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Restablece la configuración a los valores originales de portfolio.config.js.
 */
export function resetConfigToDefaults() {
  localStorage.removeItem(STORAGE_CONFIG_KEY);
  return defaultConfig;
}

/**
 * Genera el código fuente en JavaScript listo para ser copiado o descargado
 * y reemplazar el archivo portfolio.config.js en el repositorio de GitHub.
 */
export function generateConfigCode(config) {
  return `/**
 * CONFIGURACIÓN CENTRAL DEL PORTAFOLIO - WILLIAM YOVANY FRAILE BAUTISTA
 * Generado automáticamente desde el Panel de Control Secreto
 */

export const portfolioConfig = ${JSON.stringify(config, null, 2)};
`;
}

/**
 * Descarga el archivo portfolio.config.js generado
 */
export function downloadConfigFile(config) {
  const code = generateConfigCode(config);
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio.config.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function mergeFeaturedProjects(defaults, customs) {
  if (!customs || !Array.isArray(customs)) return defaults;
  
  // Mapear por ID para preservar orden y propiedades
  const customMap = new Map(customs.map(p => [p.id, p]));
  
  const merged = defaults.map(defProj => {
    const custom = customMap.get(defProj.id);
    if (custom) {
      return { ...defProj, ...custom };
    }
    return defProj;
  });

  // Agregar cualquier proyecto nuevo creado en el admin
  customs.forEach(c => {
    if (!defaults.some(d => d.id === c.id)) {
      merged.push(c);
    }
  });

  return merged;
}
