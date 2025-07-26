import type { APIRoute } from "astro";
import { db } from "../../../db/db";
import { productos, type Image } from "../../../db/schema";
import { like, sql } from "drizzle-orm";

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const searchText = searchParams.get("searchText");
    const limit = searchParams.get("limit");
    let limitNumber = 0;

    if (searchText === undefined || searchText === null)
        return new Response(
            JSON.stringify({ message: "El parámetro searchText es requerido" }),
            { status: 400 }
        );

    if (limit === undefined || limit === null)
        return new Response(
            JSON.stringify({ message: "El parámetro limit es requerido" }),
            { status: 400 }
        );

    limitNumber = Number(limit);

    if (isNaN(limitNumber))
        return new Response(
            JSON.stringify({
                message: "El parámetro limit debe ser un número",
            }),
            { status: 400 }
        );

    const products = await db
        .select({
            id: productos.id,
            descripcion: productos.descripcion,
            precio: productos.precio,
            imageUrl: sql`(SELECT url FROM imagenes as i WHERE i.producto_id = ${productos.id} LIMIT 1)`,
            // Score para ordenamiento (opcional, para debugging)
            score: sql`
            CASE 
                WHEN LOWER(${
                    productos.descripcion
                }) LIKE LOWER(${`%${searchText}%`}) THEN
                    CASE
                        WHEN LOWER(${
                            productos.descripcion
                        }) LIKE LOWER(${`${searchText}%`}) THEN 100
                        WHEN LOWER(${
                            productos.descripcion
                        }) LIKE LOWER(${`% ${searchText}%`}) THEN 90
                        WHEN LOWER(${
                            productos.descripcion
                        }) LIKE LOWER(${`%${searchText} %`}) THEN 80
                        ELSE 70
                    END
                ELSE 0
            END
        `,
        })
        .from(productos)
        .where(like(productos.descripcion, `%${searchText}%`))
        .orderBy(
            sql`
        CASE 
            WHEN LOWER(${
                productos.descripcion
            }) LIKE LOWER(${`${searchText}%`}) THEN 1
            WHEN LOWER(${
                productos.descripcion
            }) LIKE LOWER(${`% ${searchText}%`}) THEN 2
            WHEN LOWER(${
                productos.descripcion
            }) LIKE LOWER(${`%${searchText} %`}) THEN 3
            ELSE 4
        END
    `
        )
        .limit(Number(limit))
        .all();

    console.log(products);

    return new Response(JSON.stringify({ products }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
