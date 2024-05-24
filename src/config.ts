import dotenv from 'dotenv';
dotenv.config();

export const SESSION_ID = process.env.SESSION_ID || 'your-default-session-id';
export const BOT_TOKEN = process.env.BOT_TOKEN || 'your-bot-token';
export const WEBHOOK_LINK = process.env.WEBHOOK_LINK || 'your-webhook-link';
export const OWNER_ID = process.env.OWNER_ID || 'your-owner-id';
