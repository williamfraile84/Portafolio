import { generateConfigCode } from './configService';

const STORAGE_GITHUB_TOKEN_KEY = 'wf_admin_github_token';
const REPO_OWNER = 'williamfraile84';
const REPO_NAME = 'Portafolio';
const TARGET_PATH = 'src/portfolio.config.js';
const TARGET_BRANCH = 'main';

/**
 * Obtiene el GitHub Personal Access Token guardado en el navegador
 */
export function getSavedGitHubToken() {
  try {
    return localStorage.getItem(STORAGE_GITHUB_TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
}

/**
 * Guarda el GitHub Personal Access Token en el almacenamiento local del navegador
 */
export function saveGitHubToken(token) {
  try {
    if (token && token.trim()) {
      localStorage.setItem(STORAGE_GITHUB_TOKEN_KEY, token.trim());
      return { success: true };
    } else {
      localStorage.removeItem(STORAGE_GITHUB_TOKEN_KEY);
      return { success: true };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Elimina el token guardado
 */
export function clearGitHubToken() {
  try {
    localStorage.removeItem(STORAGE_GITHUB_TOKEN_KEY);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Codifica una cadena UTF-8 en Base64 de forma segura (sin fallar con acentos o emojis)
 */
function utf8ToBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

/**
 * Publica la configuración directamente en el repositorio de GitHub mediante la API REST.
 * Actualiza el archivo `src/portfolio.config.js` en la rama `main`, lo que a su vez
 * dispara automáticamente el workflow de GitHub Actions para desplegar a todo el mundo.
 */
export async function publishConfigToGitHub(configDraft, customToken = null) {
  const token = customToken || getSavedGitHubToken();
  if (!token) {
    return {
      success: false,
      message: 'No se ha proporcionado un Personal Access Token de GitHub.'
    };
  }

  const cleanToken = token.trim();
  const fileApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_PATH}?ref=${TARGET_BRANCH}`;

  try {
    // 1. Obtener el SHA actual del archivo src/portfolio.config.js
    const getRes = await fetch(fileApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    let currentSha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      currentSha = fileData.sha;
    } else if (getRes.status === 401) {
      return {
        success: false,
        message: 'Token de GitHub inválido o expirado (Error 401). Verifica los permisos de tu token.'
      };
    } else if (getRes.status === 403) {
      return {
        success: false,
        message: 'El token no tiene permisos suficientes para escribir en este repositorio (requiere permiso "Contents: Read and write").'
      };
    } else if (getRes.status !== 404) {
      const errJson = await getRes.json().catch(() => ({}));
      return {
        success: false,
        message: `Error al consultar el repositorio: ${errJson.message || getRes.statusText}`
      };
    }

    // 2. Generar el nuevo código fuente JavaScript
    const newCode = generateConfigCode(configDraft);
    const contentBase64 = utf8ToBase64(newCode);

    // 3. Realizar commit directo vía API PUT /contents/...
    const commitPayload = {
      message: 'feat(admin): actualizar configuración global del portafolio desde panel web',
      content: contentBase64,
      branch: TARGET_BRANCH
    };

    if (currentSha) {
      commitPayload.sha = currentSha;
    }

    const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify(commitPayload)
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      if (putRes.status === 401) {
        return { success: false, message: 'Autenticación fallida con GitHub (Token inválido o revocado).' };
      }
      if (putRes.status === 404) {
        return { success: false, message: 'Repositorio no encontrado. Revisa si el token tiene acceso al repo.' };
      }
      if (putRes.status === 409) {
        return { success: false, message: 'Conflicto de versiones en GitHub (409 Conflict). Intenta nuevamente en unos segundos.' };
      }
      return {
        success: false,
        message: `No se pudo guardar en GitHub: ${errData.message || putRes.statusText}`
      };
    }

    const putData = await putRes.json();

    // Guardar el token si la operación fue exitosa
    saveGitHubToken(cleanToken);

    return {
      success: true,
      commitSha: putData.commit?.sha?.substring(0, 7) || '',
      commitUrl: putData.commit?.html_url || '',
      message: '¡Configuración enviada a GitHub con éxito! El flujo de despliegue automático está compilando la versión global. En aproximadamente 30-45 segundos tus cambios estarán en vivo para todo el planeta.'
    };

  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión con la API de GitHub: ' + (error.message || 'Error desconocido')
    };
  }
}
