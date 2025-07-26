// /api/login.ts CORREGIDO
import type { APIRoute } from "astro";
import { loginApi } from "../../lib/api/auth.api";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Validaciones...
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email y contraseña son requeridos",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await loginApi(email, password);

    // 🔥 AQUÍ SE GUARDA LA COOKIE (EN EL SERVIDOR)
    cookies.set("auth-token", data.token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    cookies.set("user", data.user, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login exitoso",
        user: data.user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
