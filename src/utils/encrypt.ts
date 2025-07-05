import bcrypt from "bcryptjs";

/**
 * Encripta una contraseña usando bcrypt
 * @param {string} password - La contraseña en texto plano
 * @param {number} saltRounds - Número de rondas de salt (por defecto 12)
 * @returns {Promise<string>} - La contraseña encriptada
 */
export async function encryptPassword(password: string, saltRounds: number = 12): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error al encriptar contraseña:', error);
    throw new Error('Error al procesar la contraseña');
  }
}

/**
 * Verifica si una contraseña coincide con su hash
 * @param {string} password - La contraseña en texto plano
 * @param {string} hashedPassword - La contraseña encriptada/hash
 * @returns {Promise<boolean>} - true si coincide, false si no
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    throw new Error('Error al verificar la contraseña');
  }
}