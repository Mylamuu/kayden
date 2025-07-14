import z from "zod";

// Leaving this here incase I ever need it (copied from a different project)
// const commaSeparatedStringArray = z.preprocess((val) => {
// 	if (typeof val === "string") {
// 		return val.split(",").map((s) => s.trim());
// 	}
// 	return val;
// }, z.array(z.string()));

export const configSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
	DISCORD_TOKEN: z
		.string()
		.regex(
			/(?<mfaToken>mfa\.[a-z0-9_-]{20,})|(?<basicToken>[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27})/i,
		),
	GUILD_ID: z.string(),
	DATABASE_URL: z
		.url()
		.startsWith("postgres://", "This project only supports postgres databases"),
});

export type Config = z.infer<typeof configSchema>;
