import type { IProduct } from "../../types/product.type";
import { priceFormatterToPE } from "../../utils/priceFormatter";

interface Props {
  product: IProduct;
}

export default function ApiProductCard({ product }: Props) {
  function addToCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    console.log(`Producto agregado al carrito: ${product.id}`);
  }
  return (
    <a href={`/products/${product.id}`}>
      <div className="card card-compact bg-base-100 w-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-w-[278px] max-w-[300px]">
        <figure className="relative overflow-hidden">
          <img
            src={product.urlImagen || "https://via.placeholder.com/300x200"}
            alt={product.nombre}
            className="w-full h-56 object-scale-down transition-transform duration-300 hover:scale-105"
          />
        </figure>

        <div className="card-body">
          <div
            className="tooltip tooltip-bottom cursor-pointer"
            data-tip={product.descripcion}
          >
            <h2 className="card-title text-lg font-bold text-base-content line-clamp-1">
              {product.descripcion}
            </h2>
          </div>

          <p className="text-base-content/70 text-sm line-clamp-1 mb-2 cursor-pointer">
            {product.nombre}
          </p>

          {/* Precio */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-red-500 text-end w-full">
              {priceFormatterToPE.format(product.precio)}
            </span>
          </div>

          <div className="card-actions justify-end items-center">
            <button
              onClick={(e) => addToCart(e)}
              className="btn btn-error! btn-sm text-white hover:bg-primary!/90 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.707 2.707A1 1 0 005 16h16M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4m-8 2h4"
                />
              </svg>
              Agregar
            </button>
          </div>
        </div>

        {/* Indicador de stock */}
        <div className="absolute top-3 left-3">
          <div className="badge badge-success badge-sm text-white">
            <div className="w-2 h-2 bg-green-300 rounded-full mr-1 animate-pulse"></div>
            En stock
          </div>
        </div>
      </div>
    </a>
  );
}
