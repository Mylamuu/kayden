import { inject, singleton } from "tsyringe";
import type { Repository } from "typeorm";
import { CooldownEntity } from "../entities/cooldown";
import { DatabaseService } from "./database";
import { LoggerService } from "./logger";

export type Cooldown =
	| { onCooldown: true; remainingMs: number }
	| { onCooldown: false };

@singleton()
export class CooldownService {
	private cooldownRepository: Repository<CooldownEntity>;

	constructor(
		@inject(DatabaseService) private database: DatabaseService,
		@inject(LoggerService) private logger: LoggerService,
	) {
		this.cooldownRepository =
			this.database.dataSource.getRepository(CooldownEntity);
	}

	public async check(
		userId: string,
		commandName: string,
		cooldownMs: number,
		subcommandName?: string,
	): Promise<Cooldown> {
		const now = new Date();

		const existingCooldown = await this.cooldownRepository.findOneBy({
			userId,
			commandName,
			subcommandName,
		});

		if (existingCooldown) {
			const elapsedMs = now.getTime() - existingCooldown.createdAt.getTime();
			if (elapsedMs < cooldownMs) {
				this.logger.info(`Found existing cooldown`, [
					{ cooldownMs, elapsedMs },
				]);

				return {
					onCooldown: true,
					remainingMs: cooldownMs - elapsedMs,
				};
			} else {
				this.logger.info(`Deleting existing cooldown`, [
					{ userId, cooldownId: existingCooldown.id },
				]);

				await this.cooldownRepository.delete({ id: existingCooldown.id });
			}
		}

		const newCooldown = await this.cooldownRepository.save({
			userId,
			commandName,
			subcommandName,
		});

		this.logger.info("Created new cooldown", [
			{
				commandName,
				subcommandName,
				userId,
				cooldownId: newCooldown.id,
			},
		]);

		return { onCooldown: false };
	}
}
