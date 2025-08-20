CREATE TABLE `mood_tracking` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`mood` text NOT NULL,
	`message_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`message_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade
);
