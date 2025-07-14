import type {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";

export type GuildChatInputCommandInteraction = ChatInputCommandInteraction<'cached'>;

export interface ISubcommand<T extends SlashCommandSubcommandBuilder> {
	builder: T;
	cooldownMs?: number;
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export interface ICommand<T extends SlashCommandOptionsOnlyBuilder> {
	builder: T;
	permissions: PermissionsBitField;
	cooldownMs?: number;
	subcommands?: ISubcommand<SlashCommandSubcommandBuilder>[];
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
