export interface IProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  urlImagen: string;
  stock: number;
}

export interface IProductSearchResult {
  productos: IProduct[];
  total: number;
}
