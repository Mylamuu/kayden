import { PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../../../decorators/subcommand";
import type { GuildChatInputCommandInteraction } from "../../../interfaces/command";
import type { ISubcommand } from "../../../interfaces/subcommand";

@Subcommand("punishments")
export class ModifyPunishmentSubcommand implements ISubcommand {
	public readonly parentCommandName = "punishments";
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly builder = new SlashCommandSubcommandBuilder()
		.setName("modify")
		.setDescription("Modify a punishment to your guild");

	public async execute(interaction: GuildChatInputCommandInteraction) {
		await interaction.editReply({ content: "modify subcommand!" });
	}
}
