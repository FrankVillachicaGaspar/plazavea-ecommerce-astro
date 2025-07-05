import { useEffect, useState } from "react";
import { type ProductWithImage } from "../../db/schema"; // Ajusta si usas DTO o schema TS
import ProductCard from "./ProductCard";

interface Props {
    productsWithImage: ProductWithImage[];
    pageSize?: number;
}

export default function ProductGrid({
    productsWithImage,
    pageSize = 20,
}: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    // Validación para evitar división por cero
    const validPageSize = Math.max(1, pageSize);
    const totalPages = Math.ceil(productsWithImage.length / validPageSize);

    // Validar que currentPage esté en rango válido
    const validCurrentPage = Math.min(
        Math.max(1, currentPage),
        totalPages || 1
    );

    // Resetear página cuando cambia el dataset
    useEffect(() => {
        setCurrentPage(1);
    }, [productsWithImage.length, pageSize]);

    // Cálculo de paginación
    const startIndex = (validCurrentPage - 1) * validPageSize;
    const endIndex = validCurrentPage * validPageSize;
    const paginated = productsWithImage.slice(startIndex, endIndex);

    // Información de paginación mejorada
    const startItem = productsWithImage.length > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(endIndex, productsWithImage.length);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Grid mejorada con responsive design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginated.map((item) => (
                    <ProductCard
                        key={item.producto.id}
                        product={item.producto}
                        image={item.imagen!}
                    />
                ))}
            </div>

            {/* Controles de paginación mejorados */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 flex-wrap gap-2">
                    {/* Botón Previous */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={validCurrentPage === 1}
                        className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        ← Anterior
                    </button>

                    {/* Números de página con lógica inteligente */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;

                        // Mostrar siempre la primera página, última página, página actual y páginas adyacentes
                        const showPage =
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            Math.abs(pageNum - validCurrentPage) <= 1;

                        // Mostrar puntos suspensivos
                        const showDots =
                            (pageNum === 2 && validCurrentPage > 4) ||
                            (pageNum === totalPages - 1 &&
                                validCurrentPage < totalPages - 3);

                        if (!showPage && !showDots) return null;

                        if (showDots) {
                            return (
                                <span
                                    key={`dots-${pageNum}`}
                                    className="px-2 py-2 text-gray-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                                    validCurrentPage === pageNum
                                        ? "bg-red-600 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Botón Next */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={validCurrentPage === totalPages}
                        className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            {/* Información de paginación corregida */}
            <div className="text-center mt-4 text-sm text-gray-600">
                Mostrando {startItem} - {endItem} de {productsWithImage.length}{" "}
                productos
            </div>
        </div>
    );
}
