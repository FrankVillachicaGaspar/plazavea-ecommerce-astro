export type LoginType = {
  user: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaRegistro: string;
  };
  token: string;
};

export interface IProfile {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
  genero: string;
  tipoDocumento: string;
  numeroDocumento: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia: string;
  codigoPostal: string;
  aceptaMarketing: boolean;
  fechaRegistro: Date;
  ultimoAcceso: Date;
}
