import { useState, useRef, useEffect } from "react";
import ProductListItem from "./ProductListItem";
import { searchProduct } from "../../lib/api/products.api";
import type { IProduct } from "../../types/product.type";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async (text: string) => {
    const { productos } = await searchProduct(text);
    return productos;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    setQuery(value);

    if (value.trim()) {
      const productos = await fetchProducts(value);

      const filtered = productos.filter((p) =>
        p.descripcion!.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered.slice(0, 5)); // máximo 5 sugerencias
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleInputFocus = () => {
    if (query.trim() && results.length > 0) {
      setShowResults(true);
    }
  };

  // Efecto para manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-lg mx-auto">
      <div className="grid grid-cols-[1fr_auto] items-center px-4 py-2 bg-white rounded-4xl">
        <input
          type="text"
          placeholder="¿Qué estas buscando?"
          className="w-full focus:outline-none!"
          value={query}
          onChange={handleChange}
          onFocus={handleInputFocus}
        />
        <i className="fa fa-search "></i>
      </div>

      {showResults && query && results.length > 0 && (
        <div className="border-2 border-red-800 rounded-md absolute z-10 bg-white mt-5 w-sm sm:w-lg lg:w-4xl shadow-2xl lg:-left-[200px] p-5 ">
          <ul className="overflow-y-auto gap-3 grid grid-cols-1 lg:grid-cols-2 w-full">
            {results.map((p) => (
              <li key={p.id}>
                <ProductListItem product={p} />
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 mt-5 pt-3 flex">
            <a
              href={`/products?serchText=${query}`}
              className="text-primary text-uppercase text-xl text-center mx-auto hover:underline"
            >
              Ver más resultados
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
