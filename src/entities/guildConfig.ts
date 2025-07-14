import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import type { PunishmentEntity } from "./punishment";

@Entity({ name: "guild_configs" })
export class GuildConfigEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    guildId: string;

    @OneToMany("PunishmentEntity", (pe: PunishmentEntity) => pe.guild)
    punishments: Relation<PunishmentEntity[]>;
}