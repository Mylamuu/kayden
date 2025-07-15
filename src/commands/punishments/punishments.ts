import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../decorators/command";
import type {
	GuildChatInputCommandInteraction,
	ICommand,
} from "../../interfaces/command";

@Command()
export class PunishmentCommand implements ICommand {
	public readonly builder = new SlashCommandBuilder()
		.setName("punishments")
		.setDescription("Create, modify or remove punishments for your guild");
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	public async execute(
		interaction: GuildChatInputCommandInteraction,
	): Promise<void> {
		await interaction.editReply({ content: "hello!" });
	}
}
