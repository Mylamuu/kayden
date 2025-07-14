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
			this.commands.set(command.builder.name, command);
		}
	}

	public initialise() {
		this.client.on("interactionCreate", async (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			if (!interaction.inGuild() || !interaction.guild?.members.me) {
				return interaction.reply({
					content: "Commands can only be ran within guilds!",
					ephemeral: true,
				});
			}

			try {
				const command = this.commands.get(interaction.commandName);
				if (!command) {
					interaction.editReply("Command by that name was not found");
					return;
				}

				if (
					!interaction.guild.members.me.permissions.has(command.permissions)
				) {
					return interaction.reply({
						content: "I don't have permission to run this command :(",
						ephemeral: true,
					});
				}

				await interaction.deferReply();
				await command.execute(interaction);
			} catch (err: unknown) {
				interaction.editReply("There was an error!");
				this.logger.error("Unable to execute command", err);
			}
		});
	}
}
