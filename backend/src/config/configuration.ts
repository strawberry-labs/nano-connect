export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    databaseURL: process.env.DATABASE_URL,
    redisURL: process.env.REDIS_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRY,
    },
    cors: {
        allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [],
    },
});
