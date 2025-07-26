import type { FC } from "react";
import { priceFormatterToPE } from "../../utils/priceFormatter";
import type { IProduct } from "../../types/product.type";

interface ProductListItemProps {
  product: IProduct;
}

const ProductListItem: FC<ProductListItemProps> = ({ product }) => {
  return (
    <div className="p-1">
      <div className="flex gap-1 items-start">
        <img
          className="w-24 h-24"
          src={product.urlImagen}
          alt={`${product.id}`}
        />
        <div>
          <p className="line-clamp-2">{product.descripcion}</p>
          <p className="text-primary font-bold text-xl">
            {priceFormatterToPE.format(product.precio)}
          </p>
          <div className="btn btn-primary btn-outline mt-10">
            <a href={`/products/${product.id}`}>VER PRODUCTO</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
