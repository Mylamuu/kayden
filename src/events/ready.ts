import { inject } from "tsyringe";
import { BotEvent } from "../decorators/botEvent";
import type { IBotEvent } from "../interfaces/botEvent";
import { LoggerService } from "../services/logger";

@BotEvent()
export class ReadyEvent implements IBotEvent<"ready"> {
	public readonly name = "ready";
	public readonly once = true;

	constructor(@inject(LoggerService) private logger: LoggerService) {}

	execute() {
		this.logger.info("Events work!!");
	}
}
