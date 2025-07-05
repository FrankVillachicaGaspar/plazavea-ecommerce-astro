import fs from "node:fs";

const categorias = [
  "Tecnología", "Ropa", "Hogar", "Libros", "Juguetes",
  "Deportes", "Música", "Jardinería", "Comida", "Salud"
];

const sql: string[] = [];

sql.push("-- CATEGORÍAS");
sql.push("INSERT INTO categorias (nombre) VALUES");
sql.push(
  categorias.map((c) => `('${c}')`).join(",\n") + ";"
);

// Productos e Imágenes
let productoId = 1;

for (let categoriaId = 1; categoriaId <= categorias.length; categoriaId++) {
  for (let i = 1; i <= 20; i++) {
    const nombre = `${categorias[categoriaId - 1]} ${i}`;
    const descripcion = `Descripción del producto ${nombre}`;
    const precio = (100 + Math.random() * 100).toFixed(2);
    const stock = Math.floor(Math.random() * 50) + 1;

    sql.push(`INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES
      ('${nombre}', '${descripcion}', ${precio}, ${stock}, ${categoriaId});`);

    // Imágenes
    for (let j = 1; j <= 4; j++) {
      sql.push(`INSERT INTO imagenes (producto_id, url) VALUES
        (${productoId}, 'https://picsum.photos/200/300');`);
    }

    productoId++;
  }
}

// Recomendaciones
sql.push("-- PRODUCTOS RECOMENDADOS");

for (let pid = 1; pid <= 200; pid++) {
  const base = Math.floor((pid - 1) / 20) * 20 + 1; // inicio de su categoría
  const candidates = Array.from({ length: 20 }, (_, i) => base + i).filter((id) => id !== pid);
  const recomendaciones: number[] = [];

  while (recomendaciones.length < 10) {
    const elegido = candidates[Math.floor(Math.random() * candidates.length)];
    if (!recomendaciones.includes(elegido)) {
      recomendaciones.push(elegido);
      sql.push(`INSERT INTO productos_recomendados (producto_id, recomendado_id) VALUES (${pid}, ${elegido});`);
    }
  }
}

fs.writeFileSync("seed.sql", sql.join("\n"), "utf-8");
console.log("✅ Archivo seed.sql generado correctamente.");