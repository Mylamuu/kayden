import type {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface ICommand {
	builder: SlashCommandOptionsOnlyBuilder;
	permissions: PermissionsBitField;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
