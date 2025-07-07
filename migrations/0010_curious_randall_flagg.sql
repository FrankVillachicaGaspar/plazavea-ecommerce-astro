PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`alt_text` text NOT NULL,
	`order` integer NOT NULL,
	`active` integer DEFAULT 1,
	`banner_type` integer,
	FOREIGN KEY (`banner_type`) REFERENCES `banner_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_banners`("id", "url", "alt_text", "order", "active", "banner_type") SELECT "id", "url", "alt_text", "order", "active", "banner_type" FROM `banners`;--> statement-breakpoint
DROP TABLE `banners`;--> statement-breakpoint
ALTER TABLE `__new_banners` RENAME TO `banners`;--> statement-breakpoint
PRAGMA foreign_keys=ON;