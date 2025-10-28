export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    databaseURL: process.env.DATABASE_URL as string, // Verified by Joi schema
    redisURL: process.env.REDIS_URL as string,
    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_EXPIRY as string,
    },
    cors: {
        allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [],
    },
});
