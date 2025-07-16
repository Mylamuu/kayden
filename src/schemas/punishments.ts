import z from "zod";
export const addPunishmentModalDataSchema = z.object({
	name: z.string().max(100, "Punishment name must be 100 characters or less"),
	points: z.coerce
		.number()
		.min(0, "Points must be a non-negative number")
		.max(1000, "Points cannot exceed 1000"),
});

export type AddPunishmentModalData = z.infer<
	typeof addPunishmentModalDataSchema
>;
