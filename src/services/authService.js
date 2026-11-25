/**
 * SERVICIO DE AUTENTICACIÓN CRIPTOGRÁFICA PARA EL PANEL SECRETO
 * Utiliza Web Crypto API (SubtleCrypto) para hash SHA-256.
 * Incluye protección contra fuerza bruta con bloqueo por intentos fallidos.
 */

const STORAGE_SESSION_KEY = 'wf_admin_session';
const STORAGE_HASH_KEY = 'wf_admin_pwd_hash';
const STORAGE_ATTEMPTS_KEY = 'wf_admin_attempts';

// Hashes permitidos por defecto: 'WilliamAdmin2026!' y 'admin123'
const DEFAULT_HASHES = [
  '9f6e30f2b64d76712e6c747fd944f269df156a12879bf037f079708e1506c6f9', // WilliamAdmin2026!
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'  // admin123
];

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutos de bloqueo

/**
 * Calcula el hash SHA-256 de una cadena de texto
 */
export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica si el usuario ya está autenticado en la sesión actual
 */
export function isAuthenticated() {
  try {
    const session = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (!session) return false;
    const { token, expiresAt } = JSON.parse(session);
    if (Date.now() > expiresAt) {
      logout();
      return false;
    }
    return Boolean(token);
  } catch (e) {
    return false;
  }
}

/**
 * Inicia sesión verificando la contraseña ingresada
 */
export async function login(password) {
  // 1. Verificar si está bloqueado por intentos fallidos
  const lockoutStatus = checkLockout();
  if (lockoutStatus.locked) {
    return {
      success: false,
      message: `Bloqueado por seguridad tras múltiples intentos fallidos. Intenta nuevamente en ${lockoutStatus.remainingSeconds} segundos.`
    };
  }

  // 2. Calcular hash de la contraseña ingresada
  const inputHash = await sha256(password);

  // 3. Obtener hash configurado personalizado o usar los hashes por defecto
  const customHash = localStorage.getItem(STORAGE_HASH_KEY);
  const validHashes = customHash ? [customHash] : DEFAULT_HASHES;

  if (validHashes.includes(inputHash)) {
    // Éxito: restablecer intentos y crear sesión por 4 horas
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
    const sessionData = {
      token: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 4 * 60 * 60 * 1000
    };
    sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    return { success: true };
  } else {
    // Error: registrar intento fallido
    recordFailedAttempt();
    return {
      success: false,
      message: "Contraseña incorrecta. Acceso restringido."
    };
  }
}

/**
 * Cierra la sesión administrativa
 */
export function logout() {
  sessionStorage.removeItem(STORAGE_SESSION_KEY);
}

/**
 * Cambia la contraseña maestra de acceso administrativo
 */
export async function changePassword(newPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
  }
  const newHash = await sha256(newPassword);
  localStorage.setItem(STORAGE_HASH_KEY, newHash);
  return { success: true, message: "Contraseña actualizada exitosamente." };
}

/**
 * Restablece la contraseña a la predeterminada
 */
export function resetPasswordToDefault() {
  localStorage.removeItem(STORAGE_HASH_KEY);
}

// Helpers de Rate Limiting
function checkLockout() {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (!raw) return { locked: false };
    const { count, lockedUntil } = JSON.parse(raw);
    if (lockedUntil && Date.now() < lockedUntil) {
      const remainingSeconds = Math.ceil((lockedUntil - Date.now()) / 1000);
      return { locked: true, remainingSeconds };
    }
    return { locked: false };
  } catch (e) {
    return { locked: false };
  }
}

function recordFailedAttempt() {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    let attempts = raw ? JSON.parse(raw) : { count: 0, lockedUntil: null };
    attempts.count += 1;
    if (attempts.count >= MAX_ATTEMPTS) {
      attempts.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      attempts.count = 0; // reset counter after locking
    }
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch (e) {}
}
