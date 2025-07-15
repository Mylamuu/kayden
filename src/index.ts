import "reflect-metadata";
import { Client, GatewayIntentBits } from "discord.js";
import { container } from "tsyringe";
import { BotEventHandler } from "./services/botEventHandler";
import { CommandHandler } from "./services/commandHandler";
import { SlashCommandRegistrar } from "./services/commandRegister";
import { DatabaseService } from "./services/database";
import { LoggerService } from "./services/logger";

import "./commands";
import "./modals";
import "./events";

async function main() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });
	container.registerInstance("DiscordClient", client);

	const logger = container.resolve(LoggerService);

	client.once("ready", async () => {
		const registrar = container.resolve(SlashCommandRegistrar);
		const handler = container.resolve(CommandHandler);

		logger.info(`Logged in as ${client.user?.tag}!`);

		await registrar.registerCommands();
		handler.initialise();
	});

	const database = container.resolve(DatabaseService);
	const botEventHandler = container.resolve(BotEventHandler);

	database.initialize().then(async () => {
		botEventHandler.initialise();
		await client.login(process.env.DISCORD_TOKEN);
	});
}

main().catch(console.error);
