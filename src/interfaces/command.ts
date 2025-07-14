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

export interface ICommand<T extends SlashCommandOptionsOnlyBuilder> {
	builder: T;
	permissions: PermissionsBitField;
	cooldown?: ICommandCooldown<T>;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
