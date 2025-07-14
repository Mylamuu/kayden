import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../decorators/command";
import type {
	GuildChatInputCommandInteraction,
	ICommand,
	ICommandCooldown,
} from "../interfaces/command";

const builder = new SlashCommandBuilder()
	.setName("user-info")
	.setDescription("Get the information of a user")
	.addUserOption((opt) =>
		opt
			.setName("target")
			.setDescription("The user to get the information of")
			.setRequired(false),
	);

@Command()
export class UserInfoCommand implements ICommand<typeof builder> {
	public readonly builder = builder;
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly cooldown: ICommandCooldown<typeof builder> = {
		lengthMs: 10_000,
	};

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
