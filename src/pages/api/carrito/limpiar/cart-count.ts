import type { APIRoute } from "astro";
import { db } from "../../../../db/db";
import { carrito } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();

    if (!body) return Response.json({ message: "No body" }, { status: 400 });

    const { userId } = body;

    if (!userId)
        return Response.json(
            { message: "Id de usuario requerido" },
            { status: 400 }
        );

    const cartCount = await db.$count(carrito, eq(carrito.usuarioId, userId));

    return Response.json({ count: cartCount }, { status: 200 });
};
