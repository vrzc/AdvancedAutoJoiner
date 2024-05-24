import { Client, Message } from 'discord.js-selfbot-v13';
import { AutoReactionOptions, GiveawayData } from './types';
import { incrementStat } from './services/database';
import { SESSION_ID } from './config';
import { setTimeout as wait } from 'node:timers/promises';
import { eventEmitter as giveawayEventEmitter } from './events/giveawayCreated';
import { DiscordError } from './utils/handleErrors';
import { logger } from './utils/logger';

export class Joiner {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async autoReaction(options: AutoReactionOptions = {}) {
        const {
            sessionId = SESSION_ID,
            customBotId = [],
            reactionName,
            timeout = 5000,
            blacklistedWords = [],
            ownerId
        } = options;

        this.client.on("messageCreate", async (message: Message) => {
            try {
                if (customBotId.includes(message.author.id)) {
                    if (message.content.includes(this.client.user!.id)) {
                        const serverInv = await message.guild!.invites.create(message.channel.id);
                        if (message.embeds[0] && !blacklistedWords.includes(message.embeds[0]?.title as string)) {
                            await wait(timeout);
                            await this.reactToMessage(message, reactionName, sessionId);
                            const giveawayData: GiveawayData = { url: message.url, otherData: message.embeds[0], bot: message.author.id };
                            giveawayEventEmitter.emit("giveawayCreated", giveawayData);
                            await incrementStat('joins');
                        }
                    }
                }
            } catch (error) {
                const discordError = new DiscordError(`Error processing message: ${message.id}`);
                logger.logError(discordError);
            }
        });
    }

    private async reactToMessage(message: Message, reactionName: string | undefined, sessionId: string) {
        try {
            const reactions = message.reactions.cache;
            for (const reaction of reactions.values()) {
                if (reactionName && reaction.emoji.name !== reactionName) continue;
                await message.react(reaction.emoji);
            }
        } catch (error) {
            const discordError = new DiscordError(`Failed to react to message: ${message.id}`);
            logger.logError(discordError);
            throw discordError;
        }
    }
}
