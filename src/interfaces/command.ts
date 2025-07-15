import type {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { ISubcommand } from "./subcommand";

export enum CommandName {
	Help = "help",
	UserInfo = "user-info",
	Punishments = "punishments",
}

export type GuildChatInputCommandInteraction =
	ChatInputCommandInteraction<"cached">;

export interface ICommand {
	builder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	permissions: PermissionsBitField;
	cooldownMs?: number;
	dontDefer?: boolean;
	subcommands?: ISubcommand[];

	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
