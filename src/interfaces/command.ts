import type { CommandInteraction } from "discord.js";

export interface ICommand {
	name: string;
	description: string;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

export const CommandToken = Symbol("ICommand");
