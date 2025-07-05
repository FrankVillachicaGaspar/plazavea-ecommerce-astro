// /api/login.ts CORREGIDO
import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db/db';
import { usuarios } from '../../db/schema';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'tu-clave-secreta-muy-segura';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Validaciones...
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Buscar usuario...
    const usuario = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email.toLowerCase()))
      .get();

    if (!usuario) {
      return new Response(
        JSON.stringify({ success: false, message: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar contraseña...
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ success: false, message: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generar token
    const token = jwt.sign(
      { 
        userId: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🔥 AQUÍ SE GUARDA LA COOKIE (EN EL SERVIDOR)
    cookies.set('auth-token', token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    // Actualizar último acceso
    await db
      .update(usuarios)
      .set({ ultimoAcceso: new Date().toISOString() })
      .where(eq(usuarios.id, usuario.id));

    // Datos del usuario (sin contraseña)
    const userData = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      // ... otros campos
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login exitoso',
        user: userData
        // ⚠️ NO enviamos el token en el response, ya está en la cookie
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};