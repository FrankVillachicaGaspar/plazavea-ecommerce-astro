/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: number;
      email: string;
      nombre: string;
      apellidos: string;
      telefono: string;
      direccion: string;
    } | null;
    isAuthenticated: boolean;
    token: string;
  }
}
