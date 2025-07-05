import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Eliminar la cookie de autenticación
    cookies.delete('auth-token', {
      path: '/'
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sesión cerrada exitosamente'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en logout:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Error al cerrar sesión' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};