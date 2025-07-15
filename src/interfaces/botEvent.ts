import type { ClientEvents } from "discord.js";

type BotEventFunction<K extends keyof ClientEvents> = (
	...args: ClientEvents[K]
) => Promise<void> | void;

export interface IBotEvent<K extends keyof ClientEvents> {
	name: K;
	once?: boolean;
	execute: BotEventFunction<K>;
}

export const BotEventToken = Symbol("IBotEvent");
