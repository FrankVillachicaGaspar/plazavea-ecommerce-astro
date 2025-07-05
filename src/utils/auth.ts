import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/db"; // Ajusta la ruta según tu estructura
import { usuarios, type User } from "../db/schema"; // Ajusta la ruta según tu estructura

const JWT_SECRET = import.meta.env.JWT_SECRET || "tu-clave-secreta-muy-segura";

export interface AuthResult {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
}

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Compara una contraseña con su hash
 */
export async function comparePassword(
    password: string,
    hash: string
): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

/**
 * Genera un token JWT
 */
export function generateToken(user: User): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}

/**
 * Verifica un token JWT
 */
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Token inválido");
    }
}

/**
 * Obtiene un usuario por su ID
 */
export async function getUserById(id: number): Promise<User | null> {
    try {
        const usuario = await db
            .select({
                id: usuarios.id,
                nombre: usuarios.nombre,
                apellidos: usuarios.apellidos,
                email: usuarios.email,
                telefono: usuarios.telefono,
                fechaNacimiento: usuarios.fechaNacimiento,
                genero: usuarios.genero,
                tipoDocumento: usuarios.tipoDocumento,
                numeroDocumento: usuarios.numeroDocumento,
                departamento: usuarios.departamento,
                provincia: usuarios.provincia,
                distrito: usuarios.distrito,
                direccion: usuarios.direccion,
                referencia: usuarios.referencia,
                codigoPostal: usuarios.codigoPostal,
                aceptaMarketing: usuarios.aceptaMarketing,
                fechaRegistro: usuarios.fechaRegistro,
                ultimoAcceso: usuarios.ultimoAcceso,
                activo: usuarios.activo,
                password: usuarios.password,
                aceptaTerminos: usuarios.aceptaTerminos,
            })
            .from(usuarios)
            .where(eq(usuarios.id, id))
            .get();

        return usuario || null;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return null;
    }
}

/**
 * Obtiene un usuario por su email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const usuario = await db
            .select({
                id: usuarios.id,
                nombre: usuarios.nombre,
                apellidos: usuarios.apellidos,
                email: usuarios.email,
                telefono: usuarios.telefono,
                fechaNacimiento: usuarios.fechaNacimiento,
                genero: usuarios.genero,
                tipoDocumento: usuarios.tipoDocumento,
                numeroDocumento: usuarios.numeroDocumento,
                departamento: usuarios.departamento,
                provincia: usuarios.provincia,
                distrito: usuarios.distrito,
                direccion: usuarios.direccion,
                referencia: usuarios.referencia,
                codigoPostal: usuarios.codigoPostal,
                aceptaMarketing: usuarios.aceptaMarketing,
                fechaRegistro: usuarios.fechaRegistro,
                ultimoAcceso: usuarios.ultimoAcceso,
                activo: usuarios.activo,
                password: usuarios.password,
                aceptaTerminos: usuarios.aceptaTerminos,
            })
            .from(usuarios)
            .where(eq(usuarios.email, email.toLowerCase()))
            .get();

        return usuario || null;
    } catch (error) {
        console.error("Error al obtener usuario por email:", error);
        return null;
    }
}

/**
 * Actualiza el último acceso del usuario
 */
export async function updateLastAccess(userId: number): Promise<void> {
    try {
        await db
            .update(usuarios)
            .set({ ultimoAcceso: new Date().toISOString() })
            .where(eq(usuarios.id, userId));
    } catch (error) {
        console.error("Error al actualizar último acceso:", error);
    }
}

/**
 * Valida el formato de email
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida la fortaleza de la contraseña
 */
export function validatePassword(password: string): {
    isValid: boolean;
    message: string;
} {
    if (password.length < 8) {
        return {
            isValid: false,
            message: "La contraseña debe tener al menos 8 caracteres",
        };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe tener al menos una letra minúscula",
        };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe tener al menos una letra mayúscula",
        };
    }

    if (!/(?=.*\d)/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe tener al menos un número",
        };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return {
            isValid: false,
            message:
                "La contraseña debe tener al menos un carácter especial (@$!%*?&)",
        };
    }

    return { isValid: true, message: "Contraseña válida" };
}

/**
 * Autentica un usuario
 */
export async function authenticateUser(
    email: string,
    password: string
): Promise<AuthResult> {
    try {
        // Validar entrada
        if (!email || !password) {
            return {
                success: false,
                message: "Email y contraseña son requeridos",
            };
        }

        if (!validateEmail(email)) {
            return { success: false, message: "Formato de email inválido" };
        }

        // Buscar usuario (incluir contraseña para verificación)
        const usuario = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.email, email.toLowerCase()))
            .get();

        if (!usuario) {
            return { success: false, message: "Credenciales inválidas" };
        }

        // Verificar si la cuenta está activa
        if (!usuario.activo) {
            return {
                success: false,
                message: "Cuenta desactivada. Contacta al administrador",
            };
        }

        // Verificar contraseña
        const passwordMatch = await comparePassword(password, usuario.password);
        if (!passwordMatch) {
            return { success: false, message: "Credenciales inválidas" };
        }

        // Actualizar último acceso
        await updateLastAccess(usuario.id);

        // Preparar datos del usuario (sin contraseña)
        const userData: User = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            telefono: usuario.telefono,
            fechaNacimiento: usuario.fechaNacimiento,
            genero: usuario.genero,
            tipoDocumento: usuario.tipoDocumento,
            numeroDocumento: usuario.numeroDocumento,
            departamento: usuario.departamento,
            provincia: usuario.provincia,
            distrito: usuario.distrito,
            direccion: usuario.direccion,
            referencia: usuario.referencia,
            codigoPostal: usuario.codigoPostal,
            aceptaMarketing: usuario.aceptaMarketing,
            fechaRegistro: usuario.fechaRegistro,
            ultimoAcceso: usuario.ultimoAcceso,
            activo: usuario.activo,
            password: "",
            aceptaTerminos: false,
        };

        // Generar token
        const token = generateToken(userData);

        return {
            success: true,
            message: "Login exitoso",
            user: userData,
            token,
        };
    } catch (error: any) {
        return {
            success: false,
            message: "Error de login",
            token: "",
        };
    }
}
