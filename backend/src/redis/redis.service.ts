import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisModuleOptions } from './redis.module';
import {
    createClient,
    RedisClientType,
    RedisFunctions,
    RedisModules,
    RedisScripts,
    RespVersions,
    TypeMapping,
} from 'redis';

type RedisClient = RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts,
    RespVersions,
    TypeMapping
>;

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);

    // main client
    private client: RedisClient | undefined;

    // pub/sub clients
    public publisher: RedisClient | undefined;
    public subscriber: RedisClient | undefined;

    public streamIds = new Map<string, string>();

    constructor(
        @Inject('REDIS_OPTIONS')
        private readonly options: RedisModuleOptions,
    ) {}

    private initialize(): void {
        if (!this.client || !this.publisher || !this.subscriber) {
            throw new Error('Redis clients are not initialized');
        }

        this.client.on('error', (e) => {
            this.logger.error(e);
        });

        // Connect all clients
        void this.client.connect();
        void this.subscriber.connect();
        void this.publisher.connect();
        this.client.on('ready', () => {
            this.logger.log('Initialized Redis clients successfully');
        });
    }

    onModuleInit() {
        const clientOptions = {
            ...this.options,
            socket: {
                ...this.options.socket,
                reconnectStrategy: (retries: number) => {
                    if (retries > 3) {
                        this.logger.error(
                            'Max Redis connection retries (3) exceeded',
                        );
                        return false; // Stop retrying
                    }

                    const delay = Math.min(retries * 1000, 5000);
                    this.logger.warn(
                        `Redis connection retry ${retries}/3 in ${delay}ms`,
                    );
                    return delay;
                },
                connectTimeout: 10000, // 10 second connection timeout
            },
        };

        this.client = createClient(clientOptions);
        this.logger.log('Redis connected');

        this.publisher = this.client.duplicate();
        this.subscriber = this.client.duplicate();

        this.initialize();
    }

    async onModuleDestroy() {
        try {
            if (this.client) await this.client.quit();
            if (this.publisher) await this.publisher.quit();
            if (this.subscriber) await this.subscriber.quit();
            this.logger.log('Redis connections closed');
        } catch (err) {
            this.logger.error(`Error closing Redis connections`, err);
        }
    }

    /**
     * Checks the health of the Redis connection.
     * @returns { status: string; latency?: number }
     */
    async checkHealth(): Promise<{ status: string; latency?: number }> {
        if (!this.client?.isOpen) return { status: 'down' };

        const start = Date.now();
        try {
            await this.client.ping();
            const latency = Date.now() - start;
            return { status: 'healthy', latency };
        } catch (e) {
            this.logger.error(`Redis health check failed`, e);
            return { status: 'down' };
        }
    }

    getClient(): RedisClient | undefined {
        return this.client;
    }

    /**
     * Sets a value in Redis with an optional TTL.
     * @param key The key to set.
     * @param value The value to set.
     * @param ttl The time-to-live in seconds. If not provided, uses default TTL.
     */
    async set(key: string, value: string, ttl?: number) {
        if (!this.client) {
            throw new Error('Redis client is not initialized');
        }

        await this.client.set(key, value, { EX: ttl ?? this.options.ttl });
    }

    /**
     * Retrieves a value from Redis.
     * @param key The key to retrieve.
     * @returns The value associated with the key, or null if not found.
     */
    async get(key: string): Promise<string | null> {
        if (!this.client) {
            throw new Error('Redis client is not initialized');
        }
        return this.client.get(key);
    }

    /**
     * Deletes a value from Redis.
     * @param key The key to delete.
     */
    async del(key: string) {
        if (!this.client) {
            throw new Error('Redis client is not initialized');
        }
        await this.client.del(key);
    }
}
