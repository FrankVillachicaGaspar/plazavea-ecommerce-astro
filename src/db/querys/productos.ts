import { and, asc, eq, gt, lte, sql, SQL } from "drizzle-orm";
import { db } from "../db";
import {
    imagenes,
    productos,
    type Image,
    type ProductWithImage,
} from "../schema";

export const getProductTotalCount = async () => await db.$count(productos);

export const getPaginatedProductsWithImagenAndFilters = async (
    limit: number,
    page: number,
    categoria?: number,
    orden?: string,
    precioMax?: number
): Promise<{ products: ProductWithImage[]; total: number }> => {
    let whereClause = [gt(productos.stock, 0)];

    if (categoria) {
        whereClause.push(eq(productos.categoriaId, Number(categoria)));
    }

    if (precioMax) {
        whereClause.push(lte(productos.precio, Number(precioMax)));
    }

    if (precioMax) {
        whereClause.push(lte(productos.precio, Number(precioMax)));
    }

    const orderClause = (() => {
        switch (orden) {
            case "precioAsc":
                return productos.precio;
            case "precioDesc":
                return sql`${productos.precio} DESC`;
            default:
                return sql`RANDOM()`;
        }
    })();

    const offset = (page - 1) * limit;

    try {
        const productsWithImages: ProductWithImage[] = await db
            .select({
                producto: productos,
                imagen: imagenes,
            })
            .from(productos)
            .innerJoin(
                imagenes,
                and(
                    eq(imagenes.productoId, productos.id),
                    eq(imagenes.main, true)
                )
            )
            .where(and(...whereClause))
            .orderBy(orderClause, asc(productos.id))
            .limit(limit)
            .offset(offset);

        const total = await db.$count(productos, and(...whereClause));
        console.log(productsWithImages);
        return {
            products: productsWithImages,
            total,
        };
    } catch (error: unknown) {
        if (error instanceof Error) console.log(error.message);
        console.log(error);
    }

    return { products: [], total: 0 };
};
