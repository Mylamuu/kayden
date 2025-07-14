import { inject, singleton } from "tsyringe";
import { DataSource } from "typeorm";
import { ConfigService } from "./config";

@singleton()
export class DatabaseService {
	private _dataSource?: DataSource;

	constructor(@inject(ConfigService) private config: ConfigService) {}

	public async initialize(): Promise<void> {
		const ds = new DataSource({
			type: "postgres",
			url: this.config.get("DATABASE_URL"),
			synchronize: this.config.get("NODE_ENV") === "development",
		});

		this._dataSource = await ds.initialize();
		console.log("Database connection established successfully.");
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
