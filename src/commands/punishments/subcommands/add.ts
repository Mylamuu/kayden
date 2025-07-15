import { PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import { inject } from "tsyringe";
import { Subcommand } from "../../../decorators/subcommand";
import {
	CommandName,
	type GuildChatInputCommandInteraction,
} from "../../../interfaces/command";
import { ModalID } from "../../../interfaces/modal";
import {
	type ISubcommand,
	SubcommandName,
} from "../../../interfaces/subcommand";
import { ModalService } from "../../../services/modal";

@Subcommand(CommandName.Punishments)
export class AddPunishmentSubcommand implements ISubcommand {
	public readonly parentCommandName = CommandName.Punishments;
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly dontDefer = true;
	public readonly builder = new SlashCommandSubcommandBuilder()
		.setName(SubcommandName.AddPunishment)
		.setDescription("Add a punishment to your guild");

	constructor(@inject(ModalService) private modals: ModalService) {}

	public async execute(interaction: GuildChatInputCommandInteraction) {
		await interaction.showModal(this.modals.get(ModalID.AddPunishment));
	}
}
