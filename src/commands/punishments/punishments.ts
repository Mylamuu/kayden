import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../decorators/command";
import {
	CommandName,
	type GuildChatInputCommandInteraction,
	type ICommand,
} from "../../interfaces/command";

@Command()
export class PunishmentCommand implements ICommand {
	public readonly builder = new SlashCommandBuilder()
		.setName(CommandName.Punishments)
		.setDescription("Create, modify or remove punishments for your guild");
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	public async execute(
		interaction: GuildChatInputCommandInteraction,
	): Promise<void> {
		await interaction.editReply({ content: "hello!" });
	}
}
