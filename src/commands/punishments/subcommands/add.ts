import { PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../../../decorators/subcommand";
import type { GuildChatInputCommandInteraction } from "../../../interfaces/command";
import type { ISubcommand } from "../../../interfaces/subcommand";

@Subcommand("punishments")
export class AddPunishmentSubcommand implements ISubcommand {
	public readonly parentCommandName = "punishments";
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly builder = new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("Add a punishment to your guild");

	public async execute(interaction: GuildChatInputCommandInteraction) {
		await interaction.editReply({ content: "add subcommand!" });
	}
}
