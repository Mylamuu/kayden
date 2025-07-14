import { type Client, MessageFlags } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import {
	CommandToken,
	type GuildChatInputCommandInteraction,
	type ICommand,
	type ISubcommand,
} from "../interfaces/command";
import { CooldownService } from "./cooldown";
import { LoggerService } from "./logger";

@singleton()
export class CommandHandler {
	private readonly commands: Map<string, ICommand>;

	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@inject(CooldownService) private cooldown: CooldownService,
		@injectAll(CommandToken)
		commands: ICommand[],
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
					flags: [MessageFlags.Ephemeral],
				});
			}

			try {
				await this.handleCommand(
					interaction as GuildChatInputCommandInteraction,
				);
			} catch (err: unknown) {
				interaction.editReply("There was an error!");
				this.logger.error("Unable to execute command", err);
			}
		});
	}

	private async handleCommand(interaction: GuildChatInputCommandInteraction) {
		const command = this.commands.get(interaction.commandName);
		if (!command) {
			interaction.editReply("Command by that name was not found");
			return;
		}

		const subcommandName = interaction.options.getSubcommand(false);

		if (subcommandName && command.subcommands) {
			const subcommand = command.subcommands.find(
				(sc) => sc.builder.name === subcommandName,
			);

			if (subcommand) {
				await this.executeWithCooldown(interaction, command, subcommand);
				return;
			}
		}

		await this.executeWithCooldown(interaction, command);
	}

	private async executeWithCooldown(
		interaction: GuildChatInputCommandInteraction,
		command: ICommand,
		subcommand?: ISubcommand,
	) {
		if (!interaction.guild.members.me?.permissions.has(command.permissions)) {
			return interaction.reply({
				content: "I don't have permission to run this command :(",
				flags: [MessageFlags.Ephemeral],
			});
		}

		if (command.cooldownMs || subcommand?.cooldownMs) {
			const cooldownLengthMs =
				subcommand?.cooldownMs || command.cooldownMs || 0;

			if (cooldownLengthMs > 0) {
				const result = await this.cooldown.check(
					interaction.user.id,
					interaction.commandName,
					cooldownLengthMs,
					subcommand?.builder.name,
				);

				if (result.onCooldown) {
					await interaction.reply({
						content: `You are on cooldown for another ${Math.ceil(result.remainingMs / 1000)} seconds.`,
						flags: [MessageFlags.Ephemeral],
					});

					return;
				}
			}
		}

		await interaction.deferReply();
		await command.execute(interaction);
	}
}
