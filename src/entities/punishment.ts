import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import type { GuildConfigEntity } from "./guildConfig";

@Entity({ name: "punishments" })
export class PunishmentEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	points: number;

	@ManyToOne("GuildConfigEntity", (gce: GuildConfigEntity) => gce.punishments)
	guild: Relation<GuildConfigEntity>;
}
