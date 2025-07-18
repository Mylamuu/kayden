import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../decorators/command";
import {
	CommandName,
	type GuildChatInputCommandInteraction,
	type ICommand,
} from "../interfaces/command";

@Command()
export class UserInfoCommand implements ICommand {
	public readonly builder = new SlashCommandBuilder()
		.setName(CommandName.UserInfo)
		.setDescription("Get the information of a user")
		.addUserOption((opt) =>
			opt
				.setName("target")
				.setDescription("The user to get the information of")
				.setRequired(false),
		);
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly cooldownMs = 10_000;

	public async execute(
		interaction: GuildChatInputCommandInteraction,
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
