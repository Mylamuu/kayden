import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";

@Entity({ name: "cooldowns" })
@Unique(["userId", "commandName", "subcommandName"])
export class CooldownEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	commandName: string;

	@Column({ nullable: true })
	subcommandName: string;

	@CreateDateColumn()
	createdAt: Date;
}
