import { defineMiddleware } from "astro:middleware";
import jwt from "jsonwebtoken";

const JWT_SECRET = import.meta.env.JWT_SECRET || "tu-clave-secreta-muy-segura";

// Rutas que requieren autenticación
const protectedRoutes = ["/carrito", "/pago", "/perfil"];

// Rutas que no deben ser accesibles si ya está logueado
const guestOnlyRoutes = ["/login", "/registro", "/forgot-password"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Obtener token de las cookies
  const token = cookies.get("auth-token")?.value;
  const user = cookies.get("user")?.value;

  // Verificar si el token es válido
  let isAuthenticated = false;

  if (token) {
    isAuthenticated = true;
  }

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    // Redirigir al login si intenta acceder a una ruta protegida sin autenticación
    return redirect("/login");
  }

  // Verificar rutas solo para invitados
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isGuestOnlyRoute && isAuthenticated) {
    // Redirigir al dashboard si ya está logueado y trata de acceder a login/registro
    return redirect("/");
  }

  // Añadir información del usuario al contexto para usar en las páginas
  context.locals.user = user ? JSON.parse(user) : null;
  context.locals.isAuthenticated = isAuthenticated;
  context.locals.token = token!;

  return next();
});
