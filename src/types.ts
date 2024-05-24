export interface AutoReactionOptions {
    sessionId?: string;
    customBotId?: string[];
    reactionName?: string;
    timeout?: number;
    blacklistedWords?: string[];
    ownerId?: string;
}

export interface GiveawayData {
    url: string;
    otherData: any;
    bot: string;
}
