import { injectable, registry } from "tsyringe";
import type { CommandName } from "../interfaces/command";
import { SubcommandToken } from "../interfaces/subcommand";

export function Subcommand(parentCommandName: CommandName) {
	// biome-ignore lint/suspicious/noExplicitAny: Has to be any because the arguments to the class constructor can be anything.
	return (target: any) => {
		// biome-ignore lint/suspicious/noExplicitAny: Has to be any because the arguments to the class constructor can be anything.
		(target.prototype as any).parentCommandName = parentCommandName;

		injectable()(target);
		registry([{ token: SubcommandToken, useClass: target }])(target);
	};
}
