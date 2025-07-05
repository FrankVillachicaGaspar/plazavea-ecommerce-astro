CREATE TABLE `banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`alt_text` text NOT NULL,
	`order` integer NOT NULL,
	`active` integer DEFAULT 1
);
