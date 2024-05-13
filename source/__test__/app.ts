import express from "express"
import App from '../services/ExpressApp'
import { Redis } from 'ioredis';
import { client } from "../services/Redis";


const StartServer = async () => {
    const app = express()
    await App(app)
    return app
}

export const app = StartServer()

export async function shutdown() {
    async function closeRedisConnection(client: Redis): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            client.quit((err) => {
                if (err) {
                    reject(err);
                    return; // Exit early if error occurs
                }
                resolve();
            });

            client.once('end', () => resolve());
        });
    }

    (async () => {
        try {
            await closeRedisConnection(client);
            console.log('Redis connection closed:', client.status === 'end');
        } catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    })();
}