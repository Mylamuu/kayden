import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";
import { container, inject } from "tsyringe";
import { Command } from "../decorators/command";
import {
	CommandName,
	CommandToken,
	type GuildChatInputCommandInteraction,
	type ICommand,
} from "../interfaces/command";
import { type ISubcommand, SubcommandToken } from "../interfaces/subcommand";
import { GuildService } from "../services/guild";

@Command()
export class HelpCommand implements ICommand {
	public readonly builder = new SlashCommandBuilder()
		.setName(CommandName.Help)
		.setDescription("List every command (this is just a test)");
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	constructor(@inject(GuildService) private guilds: GuildService) {}

	public async execute(
		interaction: GuildChatInputCommandInteraction,
	): Promise<void> {
		const guildConfig = await this.guilds.get(interaction.guildId);

		const commands: ICommand[] = container.resolveAll(CommandToken);
		const subcommands: ISubcommand[] = container.resolveAll(SubcommandToken);

		const subcommandsByParent = subcommands.reduce((acc, subcommand) => {
			const parentName = subcommand.parentCommandName;
			if (!acc.has(parentName)) {
				acc.set(parentName, []);
			}

			acc.get(parentName)?.push(subcommand);
			return acc;
		}, new Map<string, ISubcommand[]>());

		const message = commands
			.reduce((acc, command) => {
				const subcmds = subcommandsByParent.get(command.builder.name);
				acc.push(
					`- **${command.builder.name}**: ${command.builder.description}`,
				);

				if (subcmds) {
					for (const subcmd of subcmds) {
						acc.push(
							`    - **${subcmd.builder.name}**: ${subcmd.builder.description}`,
						);
					}
				}

				return acc;
			}, [] as string[])
			.join("\n");

		const embed = new EmbedBuilder()
			.setTitle("Help")
			.setDescription(message)
			.setFooter({ text: `Guild config ID: ${guildConfig.id}` });

		await interaction.editReply({ embeds: [embed] });
	}
}
