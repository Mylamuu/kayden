// src/services/LoggerService.ts
import { container, singleton } from "tsyringe";
import winston, { format, transports } from "winston";
import { ConfigService } from "./config";

@singleton()
export class LoggerService {
	private readonly logger: winston.Logger;

	constructor() {
		// const config = container.resolve(ConfigService);

		this.logger = winston.createLogger({
			// level: config.get("LOG_LEVEL"),
			level: "debug",
			format: format.combine(
				format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				format.errors({ stack: true }),
				format.splat(),
				format.json(),
			),
			defaultMeta: { service: "bot" },
			transports: [
				new transports.Console({
					format: format.combine(format.colorize(), format.simple()),
				}),
				new transports.File({ filename: "logs/error.log", level: "error" }),
				new transports.File({ filename: "logs/combined.log" }),
			],
		});
	}

	public log(level: string, message: string, meta?: unknown[]) {
		this.logger.log(level, message, meta);
	}

	public info(message: string, meta?: unknown[]) {
		this.logger.info(message, meta);
	}

	public warn(message: string, meta?: unknown[]) {
		this.logger.warn(message, meta);
	}

	public error(message: string, error?: unknown, meta?: unknown[]) {
		this.logger.error(message, { ...meta, error });
	}

	public debug(message: string, meta?: unknown[]) {
		this.logger.debug(message, meta);
	}
}
