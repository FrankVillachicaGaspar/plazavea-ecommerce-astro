// src/pages/api/usuarios/registrar.ts
import type { APIRoute } from "astro";
import bcrypt from "bcryptjs";
import {usuarios} from "../../../db/schema"
import { eq } from "drizzle-orm";
import { db } from "../../../db/db";

// Interfaz para los datos del formulario
interface RegistroData {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    direccion?: string;
    referencia?: string;
    codigoPostal?: string;
    aceptaMarketing?: boolean;
    aceptaTerminos: boolean;
}

// Función para validar email
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Función para validar contraseña
const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

// Función para validar DNI peruano
const isValidDNI = (dni: string): boolean => {
    return /^\d{8}$/.test(dni);
};

// Función para validar teléfono peruano
const isValidPhone = (phone: string): boolean => {
    return /^9\d{8}$/.test(phone.replace(/\s/g, ""));
};

export const POST: APIRoute = async ({ request }) => {
    try {
        // Verificar que el content-type sea correcto
        const contentType = request.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Content-Type debe ser application/json",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Obtener datos del body
        const data: RegistroData = await request.json();

        // Validaciones básicas
        if (!data.nombre || !data.apellidos || !data.email || !data.password) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message:
                        "Los campos nombre, apellidos, email y contraseña son obligatorios",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validar formato de email
        if (!isValidEmail(data.email)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "El formato del email no es válido",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validar contraseña
        if (!isValidPassword(data.password)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "La contraseña debe tener al menos 8 caracteres",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validar teléfono si se proporciona
        if (data.telefono && !isValidPhone(data.telefono)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message:
                        "El teléfono debe ser un número válido peruano (9 dígitos)",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validar DNI si se proporciona
        if (
            data.tipoDocumento === "DNI" &&
            data.numeroDocumento &&
            !isValidDNI(data.numeroDocumento)
        ) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "El DNI debe tener 8 dígitos",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validar términos y condiciones
        if (!data.aceptaTerminos) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Debes aceptar los términos y condiciones",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Verificar si el email ya existe
        const existingUser = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.email, data.email.toLowerCase()));

        if (existingUser.length > 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Ya existe una cuenta con este email",
                }),
                {
                    status: 409,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Hash de la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // Preparar datos para inserción
        const userData = {
            nombre: data.nombre.trim(),
            apellidos: data.apellidos.trim(),
            email: data.email.toLowerCase().trim(),
            password: hashedPassword,
            telefono: data.telefono?.trim() || null,
            fechaNacimiento: data.fechaNacimiento || null,
            genero: data.genero || null,
            tipoDocumento: data.tipoDocumento || "DNI",
            numeroDocumento: data.numeroDocumento?.trim() || null,
            departamento: data.departamento?.trim() || null,
            provincia: data.provincia?.trim() || null,
            distrito: data.distrito?.trim() || null,
            direccion: data.direccion?.trim() || null,
            referencia: data.referencia?.trim() || null,
            codigoPostal: data.codigoPostal?.trim() || null,
            aceptaMarketing: data.aceptaMarketing || false,
            aceptaTerminos: true,
            fechaRegistro: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString(),
            activo: true,
        };

        // Insertar usuario en la base de datos
        const result = await db.insert(usuarios).values(userData).returning({
            id: usuarios.id,
            nombre: usuarios.nombre,
            apellidos: usuarios.apellidos,
            email: usuarios.email,
            fechaRegistro: usuarios.fechaRegistro,
        });

        const newUser = result[0];

        // Log para audit (opcional)
        console.log(
            `Nuevo usuario registrado: ${newUser.email} - ID: ${newUser.id}`
        );

        // Respuesta exitosa (sin incluir información sensible)
        return new Response(
            JSON.stringify({
                success: true,
                message: "Usuario registrado exitosamente",
                data: {
                    id: newUser.id,
                    nombre: newUser.nombre,
                    apellidos: newUser.apellidos,
                    email: newUser.email,
                    fechaRegistro: newUser.fechaRegistro,
                },
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error("Error al registrar usuario:", error);

        // Manejar errores específicos de la base de datos
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Ya existe una cuenta con este email",
                }),
                {
                    status: 409,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Error genérico
        return new Response(
            JSON.stringify({
                success: false,
                message:
                    "Error interno del servidor. Por favor, inténtalo más tarde.",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};

// Endpoint para verificar si un email ya existe (opcional)
export const GET: APIRoute = async ({ url }) => {
    try {
        const email = url.searchParams.get("email");

        if (!email) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Email es requerido",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const existingUser = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.email, email.toLowerCase()));

        return new Response(
            JSON.stringify({
                success: true,
                exists: existingUser.length > 0,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error al verificar email:", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Error interno del servidor",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};
