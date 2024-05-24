import { EventEmitter } from 'events';
import { sendToWebhook } from '../services/webhook';
import { OWNER_ID } from '../config';

const eventEmitter = new EventEmitter();

eventEmitter.on("giveawayCreated", async (giveaway: any) => {
    const embedData = {
        title: giveaway.otherData?.title || "No Title",
        description: `${giveaway.otherData?.description || "No Description"}\nTeleport to giveaway: ${giveaway.url}`,
        fields: giveaway.otherData.fields || [{ value: "No Fields", name: 'ERROR' }],
        image: giveaway.otherData.image || "",
        footer: giveaway.otherData.footer || ""
    };
    await sendToWebhook(`<@${OWNER_ID}>`, embedData);
});

export { eventEmitter };