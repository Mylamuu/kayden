import { PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import { inject } from "tsyringe";
import { Subcommand } from "../../../decorators/subcommand";
import type { GuildChatInputCommandInteraction } from "../../../interfaces/command";
import { ModalID } from "../../../interfaces/modal";
import type { ISubcommand } from "../../../interfaces/subcommand";
import { ModalService } from "../../../services/modal";

@Subcommand("punishments")
export class AddPunishmentSubcommand implements ISubcommand {
	public readonly parentCommandName = "punishments";
	public readonly permissions = new PermissionsBitField(["SendMessages"]);
	public readonly dontDefer = true;
	public readonly builder = new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("Add a punishment to your guild");

	constructor(@inject(ModalService) private modals: ModalService) {}

	public async execute(interaction: GuildChatInputCommandInteraction) {
		await interaction.showModal(this.modals.get(ModalID.AddPunishment));
	}
}
