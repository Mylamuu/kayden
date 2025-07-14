import dotenv from "dotenv";
import { inject, singleton } from "tsyringe";
import { type Config, configSchema } from "../schemas/config";
import { LoggerService } from "./logger";

@singleton()
export class ConfigService {
	private readonly values: Config;

	constructor(@inject(LoggerService) private readonly logger: LoggerService) {
		if (process.env.NODE_ENV !== "production") {
			dotenv.config({ path: ".env.local" });
		}

		const parsed = configSchema.safeParse(process.env);

		if (!parsed.success) {
			this.logger.error(
				"Invalid environment variables:",
				JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
			);

			throw new Error("Invalid environment variables.");
		}

		this.values = Object.freeze(parsed.data);
		this.logger.info("Configuration loaded and validated.");
	}

	get<T extends keyof Config>(key: T): Config[T] {
		return this.values[key];
	}
}
