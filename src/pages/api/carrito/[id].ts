import type { APIRoute } from "astro";
import { db } from "../../../db/db";
import * as schema from "../../../db/schema";
import { and, eq } from "drizzle-orm";

export const DELETE: APIRoute = async ({ params }) => {
    const productId = Number(params.id);
    const usuarioId = 1;

    if (isNaN(productId))
        return new Response(JSON.stringify({ mesage: "Id inválido" }), {
            status: 400,
        });

    await db
        .delete(schema.carrito)
        .where(
            and(
                eq(schema.carrito.usuarioId, usuarioId),
                eq(schema.carrito.productoId, productId)
            )
        );

    return new Response(
        JSON.stringify({ mensaje: "Producto eliminado del carrito" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};
