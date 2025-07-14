import {
	type CommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from "discord.js";
import { Command } from "../decorators/command";
import type { ICommand } from "../interfaces/command";

@Command()
export class UserInfoCommand implements ICommand {
	public readonly name = "userinfo";
	public readonly description = "Displays information about the user.";
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	public async execute(interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder()
			.setTitle(`Info for ${interaction.user.username}`)
			.addFields(
				{ name: "User ID", value: interaction.user.id },
				{ name: "Joined At", value: interaction.user.createdAt.toUTCString() },
			);

		await interaction.editReply({ embeds: [embed] });
	}
}
