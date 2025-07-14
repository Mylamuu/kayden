import type { Client } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import { CommandToken, type ICommand } from "../interfaces/command";
import { LoggerService } from "./logger";

@singleton()
export class CommandHandler {
	private readonly commands: Map<string, ICommand>;

	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@injectAll(CommandToken) commands: ICommand[],
	) {
		this.commands = new Map<string, ICommand>();
		for (const command of commands) {
			this.commands.set(command.name, command);
		}
	}

	public initialise() {
		this.client.on("interactionCreate", async (interaction) => {
			if (!interaction.isCommand()) return;

			try {
				await interaction.deferReply();

				const command = this.commands.get(interaction.commandName);
				if (!command) {
					interaction.editReply("Command by that name was not found");
					return;
				}

				await command.execute(interaction);
			} catch (err: unknown) {
				interaction.editReply("There was an error!");
				this.logger.error("Unable to execute command", err);
			}
		});
	}
}
