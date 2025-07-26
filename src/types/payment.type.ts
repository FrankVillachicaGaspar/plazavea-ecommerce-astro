import type { IProduct } from "./product.type";

export interface ICreatePayment {
  nombre: string;
  apellido: string;
  email: string;
  subtotal: number;
  envio: number;
  total: number;
  metodo: string;
  numeroTarjeta: string;
  fechaVencimiento: string;
  cvv: string;
  nombreTarjeta: string;
  ultima4: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  terminosAceptados: boolean;
  ip: string;
  userAgent: string;
}

export interface IPayment {
  id: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  total: number;
  subtotal: number;
  envio: number;
  fecha: string;
  metodo: string;
  numeroTarjeta: string;
  fechaVencimiento: string;
  cvv: string;
  nombreTarjeta: string;
  ultima4: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  estado: string;
  referencia: string;
  terminosAceptados: boolean;
  ip: string;
  userAgent: string;
  fechaActualizacion: string;
  detail: PaymentDetail[];
}

export interface PaymentDetail {
  pagoId: number;
  producto: IProduct;
  cantidad: number;
  precioUnitario: number;
}
