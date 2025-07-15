import { HelpCommand } from "./help";
import { PunishmentCommand } from "./punishments/punishments";
import { AddPunishmentSubcommand } from "./punishments/subcommands/add";
import { ModifyPunishmentSubcommand } from "./punishments/subcommands/modify";
import { RemovePunishmentSubcommand } from "./punishments/subcommands/remove";
import { UserInfoCommand } from "./userInfo";

export default {
	UserInfoCommand,
	HelpCommand,
	PunishmentCommand,
	AddPunishmentSubcommand,
	ModifyPunishmentSubcommand,
	RemovePunishmentSubcommand,
};
