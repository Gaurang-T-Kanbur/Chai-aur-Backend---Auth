import app from "./src/app.js"
import dbConnect from "./src/common/config/db.js"
import env from "./src/common/config/env.js"

const PORT = env.port || 3000

const start = async () => {

    await dbConnect()
    app.listen(PORT, () => {
        console.log(
            `Server is running at ${PORT} in ${env.environment} mode`
        )
})
    
}

try {
    await start()
} catch(err) {
    console.error("Failed to start server", err)
    process.exit(1)
}

