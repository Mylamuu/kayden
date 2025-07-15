import {
	ActionRowBuilder,
	ModalBuilder,
	type ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { Modal } from "../../decorators/modal";
import { type IModal, ModalID } from "../../interfaces/modal";

@Modal()
export class AddPunishmentModal implements IModal {
	public readonly builder = new ModalBuilder()
		.setTitle("Add Punishment")
		.setCustomId(ModalID.AddPunishment)
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId("punishment-name")
					.setLabel("Name")
					.setStyle(TextInputStyle.Short),
			),
		);

	public async submission(interaction: ModalSubmitInteraction) {
		const punishmentName =
			interaction.fields.getTextInputValue("punishment-name");
		await interaction.editReply({ content: punishmentName });
	}
}
