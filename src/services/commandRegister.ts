import { REST } from "@discordjs/rest";
import { type Client, Routes } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import { CommandToken, type ICommand } from "../interfaces/command";
import { LoggerService } from "./logger";

@singleton()
export class SlashCommandRegistrar {
	private readonly rest: REST;

	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@injectAll(CommandToken) private readonly commands: ICommand[],
	) {
		this.rest = new REST().setToken(process.env.DISCORD_TOKEN!);
	}

	public async registerCommands() {
		const commandPayload = this.commands.map((c) => ({
			name: c.name,
			description: c.description,
		}));

		try {
			this.logger.info("Started refreshing application (/) commands.");

			await this.rest.put(
				Routes.applicationGuildCommands(
					this.client.user!.id,
					process.env.GUILD_ID!,
				),
				{ body: commandPayload },
			);

			this.logger.info("Successfully reloaded application (/) commands.");
		} catch (error) {
			this.logger.error("Failed to register commands:", error);
		}
	}
}
