import { singleton, injectAll, inject } from "tsyringe";
import { Client, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { CommandToken, type ICommand } from "../interfaces/command";

@singleton()
export class SlashCommandRegistrar {
    private readonly rest: REST;

    constructor(
        @inject("DiscordClient") private client: Client,
        @injectAll(CommandToken) private commands: ICommand[]
    ) {
        this.rest = new REST().setToken(process.env.DISCORD_TOKEN!);
    }

    public async registerCommands() {
        const commandPayload = this.commands.map(c => ({
            name: c.name,
            description: c.description,
        }));

        try {
            console.log("Started refreshing application (/) commands.");

            await this.rest.put(
                Routes.applicationGuildCommands(this.client.user!.id, process.env.GUILD_ID!),
                { body: commandPayload },
            );

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error("Failed to register commands:", error);
        }
    }
}
