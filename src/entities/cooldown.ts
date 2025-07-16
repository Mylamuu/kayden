import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";

@Entity({ name: "cooldowns" })
@Unique(["userId", "commandName"])
export class CooldownEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	commandName: string;

	@CreateDateColumn()
	createdAt: Date;
}
