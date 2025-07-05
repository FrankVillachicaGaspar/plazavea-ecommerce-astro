import type { Product, Image } from "../../db/schema";

interface Props {
  product: Product;
  image?: Image;
}

export default function ProductCard({ product, image }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-[280px]">
      <img
        src={image?.url || "https://via.placeholder.com/300x200"}
        alt={product.nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{product.nombre}</h2>
        <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>
        <p className="text-indigo-600 font-bold mt-2">S/. {product.precio}</p>
        <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}