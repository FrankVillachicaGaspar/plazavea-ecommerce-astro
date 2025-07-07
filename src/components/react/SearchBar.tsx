import { useState } from "react";
import type { ProductWithImage } from "../../db/schema";
import ProductCard from "./ProductCard";

interface Props {
    productos: ProductWithImage[];
}

export default function SearchBar({ productos }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductWithImage[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        const filtered = productos.filter((p) =>
            p.producto.descripcion!.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered.slice(0, 5)); // máximo 5 sugerencias
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <input
                type="text"
                placeholder="Buscar producto"
                className="input input-bordered w-full"
                value={query}
                onChange={handleChange}
            />

            {query && results.length > 0 && (
                <ul className="flex overflow-x-auto gap-4 absolute z-10 bg-white border-2 border-red-800 rounded-md mt-1 w-4xl shadow-2xl -left-[200px] p-5">
                    {results.map((p) => (
                        <li key={p.producto.id} className="w-fit">
                            <a href={`/products/${p.producto.id}`}>
                                <ProductCard
                                    product={p.producto}
                                    image={p.imagen!}
                                    key={p.producto.id}
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
