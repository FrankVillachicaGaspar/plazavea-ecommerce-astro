// src/db/schema.ts
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  foreignKey,
  index,
} from "drizzle-orm/sqlite-core";

// Banners
export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  order: integer("order").notNull(),
  active: integer("active").default(1),
});

// Usuarios
export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  fechaRegistro: text("fecha_registro").default("CURRENT_TIMESTAMP"),
});

// Categorías
export const categorias = sqliteTable("categorias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  imageUrl: text("image_url").default("https://via.assets.so/img.jpg?w=240&h=145&tc=red&bg=%23f1f1f1")
});

export type Category =  typeof categorias.$inferSelect;

// Productos
export const productos = sqliteTable("productos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  precio: real("precio").notNull(),
  stock: integer("stock").notNull(),
  categoriaId: integer("categoria_id").references(() => categorias.id),
});

export type Product = typeof productos.$inferSelect;
export type ProductWithImage = {
  producto: Product;
  imagen: Image | null;
};

export const imagenes = sqliteTable(
  "imagenes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productoId: integer("producto_id").references(() => productos.id),
    url: text("url").notNull(),
  },
  (t) => [index("idx_producto_id").on(t.productoId)]
);

export type Image = typeof imagenes.$inferSelect;

// Recomendados
export const productosRecomendados = sqliteTable(
  "productos_recomendados",
  {
    productoId: integer("producto_id").references(() => productos.id),
    recomendadoId: integer("recomendado_id").references(() => productos.id),
  },
  (t) => [primaryKey({ columns: [t.productoId, t.recomendadoId] })]
);

// Carrito
export const carrito = sqliteTable(
  "carrito",
  {
    usuarioId: integer("usuario_id").references(() => usuarios.id),
    productoId: integer("producto_id").references(() => productos.id),
    cantidad: integer("cantidad").notNull(),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.productoId] })]
);

// Tabla de pagos
export const pagos = sqliteTable("pagos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuario_id").references(() => usuarios.id),
  total: real("total").notNull(),
  fecha: text("fecha").default("CURRENT_TIMESTAMP"),
  metodo: text("metodo").notNull(), // 'visa', 'mastercard', 'stripe'
  ultima4: text("ultima4", { length: 4 }),
  estado: text("estado").default("pendiente"), // 'pendiente', 'aprobado', 'fallido'
  referencia: text("referencia"), // opcional: ID externo de transacción
});

// Detalle de productos comprados en cada pago
export const pagosDetalle = sqliteTable(
  "pagos_detalle",
  {
    pagoId: integer("pago_id").references(() => pagos.id),
    productoId: integer("producto_id").references(() => productos.id),
    cantidad: integer("cantidad").notNull(),
    precioUnitario: real("precio_unitario").notNull(), // precio en el momento del pago
  },
  (t) => [
    primaryKey({ columns: [t.pagoId, t.productoId] }),
    foreignKey({ columns: [t.pagoId], foreignColumns: [pagos.id] }),
    foreignKey({ columns: [t.productoId], foreignColumns: [productos.id] }),
  ]
);
