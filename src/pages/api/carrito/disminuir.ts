import { and, eq } from "drizzle-orm";
import { db } from "../../../db/db";
import * as schema from "../../../db/schema";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const { productoId } = body;

    const carritoExistente = await db.query.carrito.findFirst({
        where: (t, { and, eq }) =>
            and(eq(t.usuarioId, 1), eq(t.productoId, productoId)),
    });

    if (carritoExistente && carritoExistente.cantidad > 1) {
        await db
            .update(schema.carrito)
            .set({ cantidad: carritoExistente.cantidad - 1 })
            .where(
                and(
                    eq(schema.carrito.usuarioId, 1),
                    eq(schema.carrito.productoId, productoId)
                )
            );
    } else {
        await db
            .delete(schema.carrito)
            .where(
                and(
                    eq(schema.carrito.usuarioId, 1),
                    eq(schema.carrito.productoId, productoId)
                )
            );
    }

    return new Response(
        JSON.stringify({ mensaje: "Carrito disminuido con éxito" }),
        {
            headers: { "Content-Type": "application/json" },
        }
    );
};
