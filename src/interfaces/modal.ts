import type { ModalBuilder, ModalSubmitInteraction } from "discord.js";

export enum ModalID {
	AddPunishment = "add-punishment",
}

export interface IModal {
	builder: ModalBuilder;

	submission: (interaction: ModalSubmitInteraction) => Promise<void>;
}

export const ModalToken = Symbol("IModal");
