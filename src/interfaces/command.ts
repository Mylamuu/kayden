import type {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { ISubcommand } from "./subcommand";

export type GuildChatInputCommandInteraction =
	ChatInputCommandInteraction<"cached">;

export interface ICommand {
	builder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	permissions: PermissionsBitField;
	cooldownMs?: number;
	subcommands?: ISubcommand[];
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
