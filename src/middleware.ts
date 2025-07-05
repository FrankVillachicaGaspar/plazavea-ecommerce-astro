import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'tu-clave-secreta-muy-segura';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/carrito',
  '/pago'
];

// Rutas que no deben ser accesibles si ya está logueado
const guestOnlyRoutes = [
  '/login',
  '/registro',
  '/forgot-password'
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Obtener token de las cookies
  const token = cookies.get('auth-token')?.value;

  // Verificar si el token es válido
  let isAuthenticated = false;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      isAuthenticated = true;
      user = decoded;
    } catch (error) {
      // Token inválido, eliminarlo
      cookies.delete('auth-token', { path: '/' });
      isAuthenticated = false;
    }
  }

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    // Redirigir al login si intenta acceder a una ruta protegida sin autenticación
    return redirect('/login');
  }

  // Verificar rutas solo para invitados
  const isGuestOnlyRoute = guestOnlyRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isGuestOnlyRoute && isAuthenticated) {
    // Redirigir al dashboard si ya está logueado y trata de acceder a login/registro
    return redirect('/');
  }

  // Añadir información del usuario al contexto para usar en las páginas
  context.locals.user = user;
  context.locals.isAuthenticated = isAuthenticated;

  return next();
});