import type {
	PermissionsBitField,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import type { CommandName, GuildChatInputCommandInteraction } from "./command";

export enum SubcommandName {
	AddPunishment = "add",
	RemovePunishment = "remove",
	ModifyPunishment = "modify",
}

export interface ISubcommand {
	parentCommandName: CommandName;
	permissions: PermissionsBitField;
	builder: SlashCommandSubcommandBuilder;
	cooldownMs?: number;
	dontDefer?: boolean;

	execute: (interaction: GuildChatInputCommandInteraction) => Promise<void>;
}

export const SubcommandToken = Symbol("ISubcommand");
