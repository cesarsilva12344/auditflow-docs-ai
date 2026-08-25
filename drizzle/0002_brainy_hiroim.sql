CREATE TABLE `adminSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` varchar(80) NOT NULL DEFAULT 'qwen',
	`baseUrl` varchar(500) NOT NULL,
	`model` varchar(120) NOT NULL DEFAULT 'qwen-plus',
	`encryptedApiKey` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminSettings_id` PRIMARY KEY(`id`)
);
