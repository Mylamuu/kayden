import type {
	PermissionsBitField,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import type { GuildChatInputCommandInteraction } from "./command";

export interface ISubcommand {
	parentCommandName: string;
	permissions: PermissionsBitField;
	builder: SlashCommandSubcommandBuilder;
	cooldownMs?: number;
	dontDefer?: boolean;

	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const SubcommandToken = Symbol("ISubcommand");
