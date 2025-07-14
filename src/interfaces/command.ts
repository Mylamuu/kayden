import type {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";

type ExtractSubcommandNames<T extends SlashCommandOptionsOnlyBuilder> =
	T["options"][number] extends SlashCommandSubcommandBuilder
		? T["options"][number]["name"]
		: never;

export interface ICommandCooldown<T extends SlashCommandOptionsOnlyBuilder> {
	lengthMs?: number;
	subcommands?: {
		[K in ExtractSubcommandNames<T>]?: number;
	} & {
		[key: string]: number | undefined;
	};
}

export type GuildChatInputCommandInteraction = ChatInputCommandInteraction<
	"raw" | "cached"
>;

export interface ISubcommand<T extends SlashCommandSubcommandBuilder> {
	builder: T;
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export interface ICommand<T extends SlashCommandOptionsOnlyBuilder> {
	builder: T;
	permissions: PermissionsBitField;
	cooldown?: ICommandCooldown<T>;
	subcommands?: ISubcommand<SlashCommandSubcommandBuilder>[];
	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
