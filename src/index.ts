import "reflect-metadata";
import { Client, GatewayIntentBits } from "discord.js";
import { container } from "tsyringe";
import { CommandHandler } from "./services/commandHandler";
import { SlashCommandRegistrar } from "./services/commandRegister";
import { LoggerService } from "./services/logger";

import "./commands";

async function main() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });
	container.registerInstance("DiscordClient", client);

	client.once("ready", async () => {
		const logger = container.resolve(LoggerService);
		const registrar = container.resolve(SlashCommandRegistrar);
		const handler = container.resolve(CommandHandler);

		logger.info(`Logged in as ${client.user!.tag}!`);

		await registrar.registerCommands();
		handler.initialise();
	});

	await client.login(process.env.DISCORD_TOKEN);
}

main().catch(console.error);
