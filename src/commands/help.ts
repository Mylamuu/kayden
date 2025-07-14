import {
	type ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { container } from "tsyringe";
import { Command } from "../decorators/command";
import { CommandToken, type ICommand } from "../interfaces/command";

const builder = new SlashCommandBuilder()
	.setName("help")
	.setDescription("List every command (this is just a test)");

@Command()
export class HelpCommand implements ICommand<typeof builder> {
	public readonly builder = builder;
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	public async execute(
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
		const commands: ICommand<SlashCommandOptionsOnlyBuilder>[] =
			container.resolveAll(CommandToken);

		const message = commands
			.map(
				(command) =>
					`- **${command.builder.name}**: ${command.builder.description}`,
			)
			.join("\n");

		await interaction.editReply({ content: message });
	}
}
