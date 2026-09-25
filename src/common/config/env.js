import "dotenv/config"

 const env = {
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export default env;
