import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";
import { container, inject } from "tsyringe";
import { Command } from "../../decorators/command";
import {
	CommandToken,
	type GuildChatInputCommandInteraction,
	type ICommand,
} from "../../interfaces/command";
import { GuildService } from "../../services/guild";

@Command()
export class HelpCommand implements ICommand {
	public readonly builder = new SlashCommandBuilder()
		.setName("punishment")
		.setDescription("Create, modify or remove punishments for your guild");
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	constructor(@inject(GuildService) private guilds: GuildService) {}

	public async execute(
		interaction: GuildChatInputCommandInteraction,
	): Promise<void> {
		const guildConfig = await this.guilds.get(interaction.guildId);

		const commands: ICommand[] = container.resolveAll(CommandToken);

		const message = commands
			.map(
				(command) =>
					`- **${command.builder.name}**: ${command.builder.description}`,
			)
			.join("\n");

		const embed = new EmbedBuilder()
			.setTitle("Help")
			.setDescription(message)
			.setFooter({ text: `Guild config ID: ${guildConfig.id}` });

		await interaction.editReply({ embeds: [embed] });
	}
}
