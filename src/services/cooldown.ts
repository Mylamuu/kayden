import { inject, singleton } from "tsyringe";
import type { Repository } from "typeorm";
import { CooldownEntity } from "../entities/cooldown";
import { ConfigService } from "./config";
import { DatabaseService } from "./database";
import { LoggerService } from "./logger";

export type Cooldown =
	| { onCooldown: true; remainingMs: number }
	| { onCooldown: false };

@singleton()
export class CooldownService {
	private cooldowns: Map<string, CooldownEntity> = new Map();
	private cooldownRepository: Repository<CooldownEntity>;
	private cooldownLocation: "database" | "memory";

	constructor(
		@inject(DatabaseService) private database: DatabaseService,
		@inject(ConfigService) private config: ConfigService,
		@inject(LoggerService) private logger: LoggerService,
	) {
		this.cooldownRepository =
			this.database.dataSource.getRepository(CooldownEntity);
		this.cooldownLocation = config.get("COOLDOWN_STORAGE_LOCATION");

		this.logger.debug(`Cooldown storage location: ${this.cooldownLocation}.`);
	}

	public async check(
		userId: string,
		commandName: string,
		cooldownMs: number,
	): Promise<Cooldown> {
		const now = new Date();

		const existingCooldown = await this.getCooldown(userId, commandName);

		if (existingCooldown) {
			const elapsedMs = now.getTime() - existingCooldown.createdAt.getTime();
			if (elapsedMs < cooldownMs) {
				this.logger.debug(`Found existing cooldown`, [
					{ cooldownMs, elapsedMs },
				]);

				return {
					onCooldown: true,
					remainingMs: cooldownMs - elapsedMs,
				};
			} else {
				this.logger.debug(`Deleting existing cooldown`, [
					{ userId, cooldownId: existingCooldown.id },
				]);

				this.deleteCooldown(existingCooldown.id);
			}
		}

		const newCooldown = await this.createCooldown(userId, commandName);

		this.logger.debug("Created new cooldown", [
			{
				commandName,
				userId,
				cooldownId: newCooldown.id,
			},
		]);

		return { onCooldown: false };
	}

	private async createCooldown(
		userId: string,
		commandName: string,
	): Promise<CooldownEntity> {
		if (this.cooldownLocation === "memory") {
			const entity: CooldownEntity = {
				id: `${userId}-${commandName}`,
				userId,
				commandName,
				createdAt: new Date(),
			};
			this.cooldowns.set(entity.id, entity);
			return entity;
		}

		return await this.cooldownRepository.save({
			userId,
			commandName,
		});
	}

	private async getCooldown(
		userId: string,
		commandName: string,
	): Promise<CooldownEntity | null> {
		if (this.cooldownLocation === "memory") {
			return this.cooldowns.get(`${userId}-${commandName}`) || null;
		}

		return this.cooldownRepository.findOneBy({ userId, commandName });
	}

	private async deleteCooldown(id: string): Promise<void> {
		if (this.cooldownLocation === "memory") {
			this.cooldowns.delete(id);
			return;
		}

		await this.cooldownRepository.delete({ id });
	}
}
