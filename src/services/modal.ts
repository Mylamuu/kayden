import { type Client, ComponentType } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import { z } from "zod";
import { prettifyError } from "zod/v4";
import { type IModal, type ModalID, ModalToken } from "../interfaces/modal";
import { LoggerService } from "./logger";

@singleton()
export class ModalService {
	private readonly modals: Map<string, IModal>;

	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@injectAll(ModalToken) private readonly resolvedModals: IModal[],
	) {
		this.modals = new Map<string, IModal>();

		for (const modal of resolvedModals) {
			const json = modal.builder.toJSON();
			this.modals.set(json.custom_id, modal);

			logger.debug(`Registered modal with custom ID '${json.custom_id}'.`);
		}
		logger.info(`Registered ${this.modals.size} modals.`);

		client.on("interactionCreate", async (interaction) => {
			if (interaction.isModalSubmit()) {
				const modal = this.modals.get(interaction.customId);

				if (!modal) {
					logger.warn(
						`Modal with ID '${interaction.customId}' was submitted but cannot be found.`,
					);
					return;
				}

				await interaction.deferReply();

				const fields: { [key: string]: unknown } = {};
				for (const actionRow of interaction.components) {
					for (const textInput of actionRow.components) {
						// This is the only type that can be in a modal as of right now.
						// If this changes, we will need to update this check, but I'm keeping it
						// here just so future updates doesn't break everything :D
						if (textInput.type !== ComponentType.TextInput) continue;

						const value = interaction.fields.getTextInputValue(
							textInput.customId,
						);

						fields[textInput.customId] = value;
					}
				}

				const result = await z.safeParseAsync(modal.schema, fields);

				if (!result.success) {
					const errorMessage = prettifyError(result.error);
					await interaction.editReply({ content: errorMessage });
					return;
				}

				await modal.submission(
					interaction,
					result.data as z.infer<typeof modal.schema>,
				);
			}
		});
	}

	get(modalId: ModalID) {
		if (!this.modals.has(modalId))
			throw new Error("Attempting to get a modal that hasn't been registered");

		// biome-ignore lint/style/noNonNullAssertion: Checked if it exists above.
		return this.modals.get(modalId)!.builder.toJSON();
	}
}
