import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClientOptions } from 'redis';

// Extended options interface to include custom settings
export interface RedisModuleOptions extends RedisClientOptions {
    ttl: number; // default ttl in seconds
}

@Global()
@Module({})
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: 'REDIS_OPTIONS',
                    useValue: options,
                },
                RedisService,
            ],
            exports: [RedisService],
        };
    }

    static forRootAsync(options: {
        useFactory: (
            ...args: any[]
        ) => RedisClientOptions | Promise<RedisClientOptions>;
        inject?: any[];
    }): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: 'REDIS_OPTIONS',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                RedisService,
            ],
            exports: [RedisService],
        };
    }
}
