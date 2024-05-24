import fetch from 'node-fetch';
import { WebhookError } from '../utils/handleErrors';
import { logger } from '../utils/logger';
import { WEBHOOK_LINK } from '../config';

export async function sendToWebhook(message: string, embedData: any): Promise<void> {
    try {
        await fetch(WEBHOOK_LINK, {
            method: 'POST',
            body: JSON.stringify({ content: message, embeds: [embedData] }),
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        const webhookError = new WebhookError(`Failed to send webhook: ${message}`);
        logger.logError(webhookError);
        throw webhookError;
    }
}

export async function sendWinNotification(ownerId: string, url: string, inv: string): Promise<void> {
    try {
        await fetch(WEBHOOK_LINK, {
            method: 'POST',
            body: JSON.stringify({ content: `<@${ownerId}> you've won a giveaway in ${url} \n ${inv}` }),
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        const webhookError = new WebhookError(`Failed to send win notification to: ${ownerId}`);
        logger.logError(webhookError);
        throw webhookError;
    }
}
