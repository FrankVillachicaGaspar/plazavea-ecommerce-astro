import { and, eq } from "drizzle-orm";
import { db } from "../../../db/db";
import * as schema from "../../../db/schema";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const { productoId, userId } = body;

    console.log("Carrito/index.ts", productoId, userId)

    const carritoExistente = await db.query.carrito.findFirst({
        where: (t, { and, eq }) =>
            and(eq(t.usuarioId, userId), eq(t.productoId, productoId)),
    });

    if (carritoExistente) {
        await db
            .update(schema.carrito)
            .set({ cantidad: carritoExistente.cantidad + 1 })
            .where(
                and(
                    eq(schema.carrito.usuarioId, userId),
                    eq(schema.carrito.productoId, productoId)
                )
            );
    } else {
        await db.insert(schema.carrito).values({
            usuarioId: userId,
            productoId,
            cantidad: 1,
        });
    }

    const updatedItems = await db
        .select()
        .from(schema.carrito)
        .where(eq(schema.carrito.usuarioId, userId));

    return new Response(JSON.stringify(updatedItems.length), {
        headers: { "Content-Type": "application/json" },
    });
};
