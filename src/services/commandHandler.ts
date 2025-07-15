import { type Client, MessageFlags } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import {
	CommandToken,
	type GuildChatInputCommandInteraction,
	type ICommand,
} from "../interfaces/command";
import { type ISubcommand, SubcommandToken } from "../interfaces/subcommand";
import { CooldownService } from "./cooldown";
import { LoggerService } from "./logger";

@singleton()
export class CommandHandler {
	private readonly commands: Map<string, ICommand>;
	private readonly subcommands: Map<string, Map<string, ISubcommand>>;

	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@inject(CooldownService) private cooldown: CooldownService,
		@injectAll(CommandToken) commands: ICommand[],
		@injectAll(SubcommandToken) subcommands: ISubcommand[],
	) {
		this.commands = new Map<string, ICommand>();
		this.subcommands = new Map<string, Map<string, ISubcommand>>();

		for (const command of commands) {
			this.commands.set(command.builder.name, command);
			this.logger.debug(`Loaded command '${command.builder.name}'.`);
		}

		for (const subcommand of subcommands) {
			const parentName = subcommand.parentCommandName;
			if (!this.subcommands.has(parentName)) {
				this.subcommands.set(parentName, new Map());
			}

			this.subcommands
				.get(parentName)
				?.set(subcommand.builder.name, subcommand);
			this.logger.debug(
				`Loaded subcommand '${subcommand.builder.name}' for parent '${parentName}'.`,
			);
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
		const parentCommandName = interaction.commandName;
		const subcommandName = interaction.options.getSubcommand(false);

		let commandToExecute: ICommand | ISubcommand | undefined;
		const parentCommand: ICommand | undefined =
			this.commands.get(parentCommandName);

		if (!parentCommand) {
			this.logger.warn(`No parent command found for: /${parentCommandName}`);
			return;
		}

		if (subcommandName) {
			commandToExecute = this.subcommands
				.get(parentCommandName)
				?.get(subcommandName);
		} else {
			commandToExecute = parentCommand;
		}

		if (!commandToExecute) {
			this.logger.warn(
				`No handler found for command: /${parentCommandName} ${
					subcommandName || ""
				}`,
			);
			interaction.editReply("Command by that name was not found");
			return;
		}

		await this.executeWithCooldown(interaction, commandToExecute);
	}

	private async executeWithCooldown(
		interaction: GuildChatInputCommandInteraction,
		command: ICommand | ISubcommand,
	) {
		if (!interaction.guild.members.me?.permissions.has(command.permissions)) {
			return interaction.reply({
				content: "I don't have permission to run this command :(",
				flags: [MessageFlags.Ephemeral],
			});
		}

		if (command.cooldownMs) {
			const cooldownLengthMs = command.cooldownMs || 0;

			if (cooldownLengthMs > 0) {
				const result = await this.cooldown.check(
					interaction.user.id,
					interaction.commandName,
					cooldownLengthMs,
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
