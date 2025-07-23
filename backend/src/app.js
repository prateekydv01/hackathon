import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//Middlewares
app.use(
    cors({
      origin: ["https://deploy-mern-1whq.vercel.app"],
      methods: ["POST", "GET"],
       credentials: true

    })
)

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes
import healthcheckRouter from "./routers/healthCheck.routes.js"
import userRouer from "./routers/user.router.js"
import emergencyRouter from "./routers/emergency.routes.js"
import chatRouter from "./routers/chat.routes.js"
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouer)
app.use("/api/v1/emergency", emergencyRouter)
app.use("/api/v1/chat", chatRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statuscode || 500;

  res.status(statusCode).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    data: err.data || null,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export {app}