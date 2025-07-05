/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: {
            userId: number;
            email: string;
            nombre: string;
            apellidos: string;
        } | null;
        isAuthenticated: boolean;
    }
}
