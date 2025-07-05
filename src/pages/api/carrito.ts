import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import * as schema from "../../db/schema";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const { productoId } = body;

    const carritoExistente = await db.query.carrito.findFirst({
        where: (t, { and, eq }) =>
            and(eq(t.usuarioId, 1), eq(t.productoId, productoId)),
    });

    if (carritoExistente) {
        await db
            .update(schema.carrito)
            .set({ cantidad: carritoExistente.cantidad + 1 })
            .where(
                and(
                    eq(schema.carrito.usuarioId, 1),
                    eq(schema.productos.id, productoId)
                )
            );
    } else {
        await db.insert(schema.carrito).values({
            usuarioId: 1,
            productoId,
            cantidad: 1,
        });
    }

    const updatedItems = await db
        .select()
        .from(schema.carrito)
        .where(eq(schema.carrito.usuarioId, 1));

    return new Response(JSON.stringify(updatedItems.length), {
        headers: { "Content-Type": "application/json" },
    });
};
