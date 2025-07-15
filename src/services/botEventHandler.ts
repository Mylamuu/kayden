import type { Client, ClientEvents } from "discord.js";
import { inject, injectAll, singleton } from "tsyringe";
import { BotEventToken, type IBotEvent } from "../interfaces/botEvent";
import { LoggerService } from "./logger";

@singleton()
export class BotEventHandler {
	constructor(
		@inject("DiscordClient") private readonly client: Client,
		@inject(LoggerService) private readonly logger: LoggerService,
		@injectAll(BotEventToken)
		private readonly events: IBotEvent<keyof ClientEvents>[],
	) {}

	initialise() {
		for (const event of this.events) {
			if (event.once) {
				this.client.once(event.name, event.execute.bind(event));
			} else {
				this.client.on(event.name, event.execute.bind(event));
			}

			this.logger.debug(
				`Registered event '${event.name}' (once=${event.once ?? false}).`,
			);
		}

		this.logger.info(`Registered ${this.events.length} events.`);
	}
}
