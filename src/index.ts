import { Client } from 'discord.js-selfbot-v13';
import { Joiner } from './joiner';
import { getStat } from './services/database';
import { WEBHOOK_LINK, BOT_TOKEN, OWNER_ID } from './config';
import fetch from 'node-fetch';
import { logger } from './utils/logger';
import { WebhookError, DiscordError } from './utils/handleErrors';

const client = new Client();

const joiner = new Joiner(client);
joiner.autoReaction({ timeout: 2000, customBotId: ['530082442967646230'], ownerId: OWNER_ID });

client.on("messageCreate", async message => {
    if (message.content.startsWith("!stats")) {
        try {
            const wins = await getStat('wins');
            const joins = await getStat('joins');

            await fetch(WEBHOOK_LINK, {
                method: 'POST',
                body: JSON.stringify({
                    embeds: [{
                        author: { name: `${client.user!.username} Stats!`, icon_url: client.user!.displayAvatarURL() },
                        fields: [
                            { name: "Client INFO", value: `\n` },
                            { name: "Username", value: client.user!.username, inline: true },
                            { name: "Guild Count", value: client.guilds.cache.size, inline: true },
                            { name: "Token", value: client.token, inline: false },
                            { name: '\u200b', value: '\u200b', inline: false },
                            { name: "Wins", value: String(wins), inline: true },
                            { name: "Giveaway joined", value: String(joins), inline: true }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: { text: "Stats are synced!", icon_url: client.user!.displayAvatarURL() }
                    }]
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            const webhookError = new WebhookError(`Failed to send stats for message: ${message.id}`);
            logger.logError(webhookError);
        }
    }
});

client.login(BOT_TOKEN).catch(error => {
    const loginError = new DiscordError(`Failed to login with token`);
    logger.logError(loginError);
    process.exit(1);
});

process.on('unhandledRejection', error => {
    logger.logError(new Error(`Unhandled Rejection: ${error}`));
});

process.on('uncaughtException', error => {
    logger.logError(new Error(`Uncaught Exception: ${error}`));
    process.exit(1);
});
