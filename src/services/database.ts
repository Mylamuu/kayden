import { inject, singleton } from "tsyringe";
import { DataSource } from "typeorm";
import { CooldownEntity } from "../entities/cooldown";
import { ConfigService } from "./config";
import { LoggerService } from "./logger";

@singleton()
export class DatabaseService {
	private _dataSource?: DataSource;

	constructor(
		@inject(ConfigService) private config: ConfigService,
		@inject(LoggerService) private logger: LoggerService,
	) {}

	public async initialize(): Promise<void> {
		const ds = new DataSource({
			type: "postgres",
			url: this.config.get("DATABASE_URL"),
			synchronize: this.config.get("NODE_ENV") === "development",
			entities: [CooldownEntity],
		});

		this._dataSource = await ds.initialize();
		this.logger.info("Database connection established successfully.");
	}

	public get dataSource(): DataSource {
		if (!this._dataSource) {
			throw new Error(
				"Database has not been initialized. Please call initialize() first.",
			);
		}

		return this._dataSource;
	}
}
