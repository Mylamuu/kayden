import {
	type ActionRowBuilder,
	type ButtonBuilder,
	EmbedBuilder,
	type HexColorString,
	type InteractionEditReplyOptions,
	type InteractionReplyOptions,
	MessageFlags,
	type ModalSubmitInteraction,
	type StringSelectMenuBuilder,
} from "discord.js";
import { inject, singleton } from "tsyringe";
import type { GuildChatInputCommandInteraction } from "../interfaces/command";
import { ConfigService } from "./config";
import { LoggerService } from "./logger";

export type ReplyOptions = {
	ephemeral?: boolean;
	components?: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[];
	files?: InteractionReplyOptions["files"];
};

type InteractionWithReply =
	| ModalSubmitInteraction
	| GuildChatInputCommandInteraction;

@singleton()
export class ResponseHandler {
	private readonly brandColor: HexColorString;
	private readonly colours = {
		success: 0x57f287, // Green
		error: 0xed4245, // Red
		info: 0x7289da, // Blue
	};

	constructor(
		@inject(LoggerService) private readonly logger: LoggerService,
		@inject(ConfigService) private readonly configService: ConfigService,
	) {
		this.brandColor = configService.get("BRAND_COLOUR") as HexColorString;
	}

	public async success(
		interaction: InteractionWithReply,
		message: string,
		options?: ReplyOptions,
	): Promise<void> {
		const embed = this.createBaseEmbed()
			.setColor(this.colours.success)
			.setDescription(message);

		await this.send(interaction, { embeds: [embed], ...options });
	}

	public async error(
		interaction: InteractionWithReply,
		message: string,
		options: ReplyOptions = { ephemeral: true },
	): Promise<void> {
		const embed = this.createBaseEmbed()
			.setColor(this.colours.error)
			.setDescription(message);

		await this.send(interaction, { embeds: [embed], ...options });
	}

	public async info(
		interaction: InteractionWithReply,
		message: string,
		options?: ReplyOptions,
	): Promise<void> {
		const embed = this.createBaseEmbed().setDescription(message);
		await this.send(interaction, { embeds: [embed], ...options });
	}

	public async embed(
		interaction: InteractionWithReply,
		embed: EmbedBuilder,
		options?: ReplyOptions,
	): Promise<void> {
		await this.send(interaction, { embeds: [embed], ...options });
	}

	private createBaseEmbed(): EmbedBuilder {
		return new EmbedBuilder().setColor("Aqua").setTimestamp();
	}

	private async send(
		interaction: InteractionWithReply,
		payloadWithOptions: InteractionReplyOptions & ReplyOptions,
	): Promise<void> {
		const { ephemeral, ...payload } = payloadWithOptions;

		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply(payload as InteractionEditReplyOptions);
			} else {
				if (ephemeral) {
					payload.flags = [MessageFlags.Ephemeral];
				}
				await interaction.reply(payload);
			}
		} catch (error) {
			this.logger.error("Failed to send interaction reply", error);
		}
	}
}
