const builder = new SlashCommandBuilder()
	.setName("punishment")
	.setDescription("Create, modify or remove punishments for your guild");

@Command()
export class HelpCommand implements ICommand<typeof builder> {
	public readonly builder = builder;
	public readonly permissions = new PermissionsBitField(["SendMessages"]);

	constructor(@inject(GuildService) private guilds: GuildService) {}

	public async execute(
		interaction: GuildChatInputCommandInteraction,
	): Promise<void> {
		const guildConfig = await this.guilds.get(interaction.guildId);

		const commands: ICommand<SlashCommandOptionsOnlyBuilder>[] =
			container.resolveAll(CommandToken);

		const message = commands
			.map(
				(command) =>
					`- **${command.builder.name}**: ${command.builder.description}`,
			)
			.join("\n");

		const embed = new EmbedBuilder()
			.setTitle("Help")
			.setDescription(message)
			.setFooter({ text: `Guild config ID: ${guildConfig.id}` });

		await interaction.editReply({ embeds: [embed] });
	}
}
