import { PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../../../decorators/subcommand";
import {
	CommandName,
	type GuildChatInputCommandInteraction,
} from "../../../interfaces/command";
import {
	type ISubcommand,
	SubcommandName,
} from "../../../interfaces/subcommand";

@Subcommand(CommandName.Punishments)
export class ModifyPunishmentSubcommand implements ISubcommand {
	public readonly parentCommandName = CommandName.Punishments;
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly builder = new SlashCommandSubcommandBuilder()
		.setName(SubcommandName.ModifyPunishment)
		.setDescription("Modify a punishment to your guild");

	public async execute(interaction: GuildChatInputCommandInteraction) {
		await interaction.editReply({ content: "modify subcommand!" });
	}
}
