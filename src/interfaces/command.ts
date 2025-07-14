import type { CommandInteraction, PermissionsBitField } from "discord.js";

export interface ICommand {
	name: string;
	description: string;
	permissions: PermissionsBitField;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
