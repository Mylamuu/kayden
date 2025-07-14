import { injectable, registry } from "tsyringe";
import { CommandToken } from "../interfaces/command";

export function Command() {
	// biome-ignore lint/suspicious/noExplicitAny: Has to be any because the arguments to the class constructor can be anything.
	return (target: any) => {
		injectable()(target);
		registry([{ token: CommandToken, useClass: target }])(target);
	};
}
