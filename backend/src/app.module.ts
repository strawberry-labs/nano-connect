import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config/schema';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: configValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const nodeEnv = configService.get<string>(
                    'NODE_ENV',
                    'development',
                );
                const isDevelopment = nodeEnv === 'development';

                return {
                    type: 'postgres',
                    url: configService.get<string>('DATABASE_URL'),

                    // Connection pool settings
                    extra: {
                        max: 20,
                        min: 2,
                        connectionTimeoutMillis: 10000,
                        idleTimeoutMillis: 30000,
                        acquireTimeoutMillis: 60000,

                        // SSL configuration
                        ssl:
                            configService.get<string>('NODE_ENV') ===
                            'production'
                                ? { rejectUnauthorized: false }
                                : false,
                    },

                    // TypeORM settings
                    autoLoadEntities: true,
                    synchronize: isDevelopment,
                    logging: isDevelopment ? ['query', 'error'] : ['error'],

                    // Retry configuration
                    retryAttempts: 3,
                    retryDelay: 3000,

                    // Migration settings
                    migrations: ['dist/migrations/*{.ts,.js}'],
                    migrationsTableName: 'typeorm_migrations',
                    migrationsRun: false,
                };
            },
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    url: configService.get<string>('REDIS_URL'),
                    ttl: 86400, // 24 hours
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
