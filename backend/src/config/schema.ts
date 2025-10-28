import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
    // App Configuration
    NODE_ENV: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),
    PORT: Joi.number().default(3000),
    CORS_ORIGINS: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
    }),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'debug')
        .default('info'),

    // Database Configuration
    DATABASE_URL: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // Redis Configuration
    REDIS_URL: Joi.string().optional(),

    // JWT Configuration
    JWT_SECRET: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.string().required().min(32),
        otherwise: Joi.string().default('default-jwt-secret--change-me'),
    }),
    JWT_EXPIRY: Joi.string().default('3600s'),
});
