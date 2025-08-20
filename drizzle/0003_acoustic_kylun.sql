DROP TABLE `mood_tracking`;--> statement-breakpoint
ALTER TABLE `conversations` ADD `mood` text DEFAULT 'neutral' NOT NULL;