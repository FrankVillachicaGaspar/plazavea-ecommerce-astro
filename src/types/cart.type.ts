import type { IProduct } from "./product.type";

export interface ICart {
  producto: IProduct;
  usuarioId: number;
  cantidad: number;
}

export interface ICartResume {
  subTotal: number;
  envio: number;
  total: number;
}
