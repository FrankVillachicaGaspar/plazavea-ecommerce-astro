ALTER TABLE `usuarios` ADD `apellidos` text NOT NULL;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `telefono` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `fecha_nacimiento` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `genero` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `tipo_documento` text DEFAULT 'DNI';--> statement-breakpoint
ALTER TABLE `usuarios` ADD `numero_documento` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `departamento` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `provincia` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `distrito` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `direccion` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `referencia` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `codigo_postal` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `acepta_marketing` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `acepta_terminos` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `ultimo_acceso` text;--> statement-breakpoint
ALTER TABLE `usuarios` ADD `activo` integer DEFAULT true;