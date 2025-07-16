import type { ModalBuilder, ModalSubmitInteraction } from "discord.js";
import type z from "zod";

export enum ModalID {
	AddPunishment = "add-punishment",
}

export interface IModal<T extends z.ZodObject = z.ZodObject> {
	builder: ModalBuilder;
	schema: T;

	submission: (
		interaction: ModalSubmitInteraction,
		data: z.infer<T>,
	) => Promise<void>;
}

export const ModalToken = Symbol("IModal");
