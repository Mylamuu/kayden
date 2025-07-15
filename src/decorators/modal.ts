import { injectable, registry } from "tsyringe";
import { ModalToken } from "../interfaces/modal";

export function Modal() {
	// biome-ignore lint/suspicious/noExplicitAny: Has to be any because the arguments to the class constructor can be anything.
	return (target: any) => {
		injectable()(target);
		registry([{ token: ModalToken, useClass: target }])(target);
	};
}
