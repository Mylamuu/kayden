import { injectable, registry } from "tsyringe";
import { BotEventToken } from "../interfaces/botEvent";

export function BotEvent() {
	// biome-ignore lint/suspicious/noExplicitAny: Has to be any because the arguments to the class constructor can be anything.
	return (target: any) => {
		injectable()(target);
		registry([{ token: BotEventToken, useClass: target }])(target);
	};
}
