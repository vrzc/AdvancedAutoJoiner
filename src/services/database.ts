import { JsonDB, Config } from 'node-json-db';
import { DatabaseError } from '../utils/handleErrors';
import { logger } from '../utils/logger';

const db = new JsonDB(new Config("stats", true, false, '/'));

export async function incrementStat(stat: string): Promise<void> {
    try {
        const exists = await db.exists(`/${stat}`);
        const value = exists ? await db.getData(`/${stat}`) : 0;
        await db.push(`/${stat}`, value + 1);
    } catch (error) {
        const dbError = new DatabaseError(`Failed to increment stat: ${stat}`);
        logger.logError(dbError);
        throw dbError;
    }
}

export async function getStat(stat: string): Promise<number> {
    try {
        return await db.exists(`/${stat}`) ? await db.getData(`/${stat}`) : 0;
    } catch (error) {
        const dbError = new DatabaseError(`Failed to get stat: ${stat}`);
        logger.logError(dbError);
        throw dbError;
    }
}
