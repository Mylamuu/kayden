import { inject, singleton } from "tsyringe";
import type { Repository } from "typeorm";
import { GuildConfigEntity } from "../entities/guildConfig";
import { DatabaseService } from "./database";

@singleton()
export class GuildService {
	private guildConfigRepository: Repository<GuildConfigEntity>;

	constructor(@inject(DatabaseService) private database: DatabaseService) {
		this.guildConfigRepository =
			this.database.dataSource.getRepository(GuildConfigEntity);
	}

	public async get(guildId: string): Promise<GuildConfigEntity> {
		let config = await this.guildConfigRepository.findOneBy({ guildId });

		if (!config) {
			config = this.guildConfigRepository.create({ guildId });
			await this.guildConfigRepository.save(config);
		}

		return config;
	}
}
