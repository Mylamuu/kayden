import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../decorators/command";
import type { ICommand } from "../interfaces/command";

@Command()
export class UserInfoCommand implements ICommand {
	public readonly builder = new SlashCommandBuilder()
		.setName("user-info")
		.setDescription("Get the information of a user")
		.addUserOption((opt) =>
			opt
				.setName("target")
				.setDescription("The user to get the information of")
				.setRequired(false),
		);
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	public async execute(
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
		const target =
			interaction.options.getUser("target", false) ?? interaction.user;

		const embed = new EmbedBuilder()
			.setTitle(`Info for ${target.username}`)
			.addFields(
				{ name: "User ID", value: target.id },
				{ name: "Joined At", value: target.createdAt.toUTCString() },
			);

		await interaction.editReply({ embeds: [embed] });
	}
}
