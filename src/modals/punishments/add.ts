import {
	ActionRowBuilder,
	ModalBuilder,
	type ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { Modal } from "../../decorators/modal";
import { type IModal, ModalID } from "../../interfaces/modal";
import {
	type AddPunishmentModalData,
	addPunishmentModalDataSchema,
} from "../../schemas/punishments";

@Modal()
export class AddPunishmentModal
	implements IModal<typeof addPunishmentModalDataSchema>
{
	public readonly builder = new ModalBuilder()
		.setTitle("Add Punishment")
		.setCustomId(ModalID.AddPunishment)
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId("name")
					.setLabel("Name")
					.setPlaceholder("Enter the name of the punishment")
					.setRequired(true)
					.setMaxLength(100)
					.setStyle(TextInputStyle.Short),
			),
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId("points")
					.setLabel("Points")
					.setPlaceholder("Enter how many points this punishment is worth")
					.setRequired(true)
					.setMaxLength(10)
					.setStyle(TextInputStyle.Short),
			),
		);

	public readonly schema = addPunishmentModalDataSchema;

	public async submission(
		interaction: ModalSubmitInteraction,
		data: AddPunishmentModalData,
	) {
		await interaction.editReply({
			content: `Punishment "${data.name}" with ${data.points} points added successfully!`,
		});
	}
}
