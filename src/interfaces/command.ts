import type {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";

export type GuildChatInputCommandInteraction =
	ChatInputCommandInteraction<"cached">;

export interface ISubcommand {
	builder: SlashCommandSubcommandBuilder;
	cooldownMs?: number;
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export interface ICommand {
	builder: SlashCommandOptionsOnlyBuilder;
	permissions: PermissionsBitField;
	cooldownMs?: number;
	subcommands?: ISubcommand[];
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
