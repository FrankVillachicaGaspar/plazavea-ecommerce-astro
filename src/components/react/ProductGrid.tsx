import { type ProductWithImage } from "../../db/schema"; // Ajusta si usas DTO o schema TS
import ProductCard from "./ProductCard";
import { usePagination } from "@mantine/hooks"; // Asegúrate de tener este hook
import clsx from "clsx"; // Asegúrate de tener clsx instalado
interface Props {
    productsWithImage: ProductWithImage[];
    limit: number;
    page: number;
    totalCount: number;
}

export default function ProductGrid({
    productsWithImage,
    limit,
    page,
    totalCount,
}: Props) {
    const offset = limit * (page - 1);

    const pagination = usePagination({
        total: Math.ceil(totalCount / limit),
        initialPage: page,
        boundaries: 3,
    });

    const goToPage = (newPage: number | "dots") => {
        if (newPage === "dots") return;
        const url = new URL(window.location.href);
        url.searchParams.set("page", newPage.toString());
        window.location.href = url.toString();
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Grid mejorada con responsive design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {productsWithImage.map((item) => (
                    <ProductCard
                        key={item.producto.id}
                        product={item.producto}
                        image={item.imagen!}
                    />
                ))}
            </div>

            {/* Controles de paginación mejorados */}
            <div>
                <i className="fa fa-left"></i>
            </div>
            <div className="flex w-full">
                <div className="flex gap-3 mx-auto">
                    {pagination.range.map((p) =>
                        p === "dots" ? (
                            <span key={p} className="mx-2 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button
                                className={clsx(
                                    "btn",
                                    p === page
                                        ? "bg-primary! text-white"
                                        : "btn-outline"
                                )}
                                key={p}
                                onClick={() => goToPage(p)}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>
            </div>
            <div>
                <i className="fa fa-right"></i>
            </div>
            {/* Información de paginación corregida */}
            <div className="text-center mt-4 text-sm text-gray-600">
                Mostrando {offset + 1} - {offset + limit} de{" "}
                {totalCount} productos
            </div>
        </div>
    );
}
