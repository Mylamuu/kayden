import { REST } from "@discordjs/rest";
import { type Client, Routes, SlashCommandBuilder } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import { CommandToken, type ICommand } from "../interfaces/command";
import { type ISubcommand, SubcommandToken } from "../interfaces/subcommand";
import { ConfigService } from "./config";
import { LoggerService } from "./logger";

@singleton()
export class SlashCommandRegistrar {
	private readonly rest: REST;

	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@inject(ConfigService) private readonly config: ConfigService,
		@injectAll(CommandToken) private readonly commands: ICommand[],
		@injectAll(SubcommandToken) private readonly subcommands: ISubcommand[],
	) {
		this.rest = new REST().setToken(config.get("DISCORD_TOKEN"));
	}

	public async registerCommands() {
		const subcommandsByParent = this.subcommands.reduce((acc, subcommand) => {
			const parentName = subcommand.parentCommandName;
			if (!acc.has(parentName)) {
				acc.set(parentName, []);
			}

			acc.get(parentName)?.push(subcommand);
			return acc;
		}, new Map<string, ISubcommand[]>());

		const commandPayload = this.commands.map((command) => {
			const parentBuilder = command.builder;
			const associatedSubcommands =
				subcommandsByParent.get(parentBuilder.name) || [];

			for (const subcommand of associatedSubcommands) {
				if (parentBuilder instanceof SlashCommandBuilder) {
					this.logger.debug(
						`Adding subcommand '${subcommand.builder.name}' onto '${parentBuilder.name}.'`,
					);
					parentBuilder.addSubcommand(subcommand.builder);
					continue;
				}

				this.logger.warn(
					`Cannot add subcommand '${subcommand.builder.name}' to '${parentBuilder.name}' because it has options attached.`,
				);
			}

			return parentBuilder.toJSON();
		});

		try {
			this.logger.info("Started refreshing application (/) commands.");

			if (!this.client.user?.id) throw new Error("No application ID");

			await this.rest.put(
				Routes.applicationGuildCommands(
					this.client.user.id,
					this.config.get("GUILD_ID"),
				),
				{ body: commandPayload },
			);

			this.logger.debug(
				`Registered ${this.commands.length} commands and ${this.subcommands.length} subcommands.`,
			);
			this.logger.info("Successfully reloaded application (/) commands.");
		} catch (error) {
			this.logger.error("Failed to register commands:", error);
		}
	}
}
