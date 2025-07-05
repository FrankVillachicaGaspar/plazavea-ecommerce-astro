import { useState } from "react";
import { type ProductWithImage } from "../../db/schema"; // Ajusta si usas DTO o schema TS
import ProductCard from "./ProductCard";

interface Props {
    productsWithImage: ProductWithImage[];
    pageSize?: number;
}

export default function ProductGrid({
    productsWithImage,
    pageSize = 8,
}: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(productsWithImage.length / pageSize);

    const paginated = productsWithImage.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap space-x-6 space-y-6">
                {paginated.map((item) => (
                    <ProductCard
                        key={item.producto.id}
                        product={item.producto}
                        image={item.imagen!}
                    />
                ))}
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm ${
                            currentPage === i + 1
                                ? "btn-primary"
                                : "btn-outline"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
