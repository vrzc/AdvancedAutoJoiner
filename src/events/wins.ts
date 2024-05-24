import { EventEmitter } from 'events';
import { sendWinNotification } from '../services/webhook';

const eventEmitter = new EventEmitter();

eventEmitter.on("wins", async (data: any) => {
    await sendWinNotification(data.owner, data.data.url, data.inv);
});

export { eventEmitter };