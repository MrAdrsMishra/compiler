import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// for limit of data transfer
// 128kb keeps the body parser aligned with the security guard limits
// (MAX_CODE_SIZE_BYTES = 64KB + MAX_STDIN_SIZE_BYTES = 32KB + JSON overhead)
app.use(express.json({
    limit: "128kb"
}))
// for reading data on encoded url of text
app.use(express.urlencoded({
    extended:true,
    limit:"128kb"
}))
// Trust reverse proxy hops so req.ip resolves to the real client IP
// (nginx sets X-Forwarded-For; Cloudflare is handled by nginx real_ip module)
app.set("trust proxy", true)
// for static assets usage
app.use("/accessstatic",express.static(path.join(__dirname,'public')))
// for cookies handling
app.use(cookieParser())
import compilerRouter from './routes/compilerRouter.routes.js';
app.get("/health", (req, res) => res.json({ status: "ok", service: "compiler-backend" }));
app.get("/practice/health", (req, res) => res.json({ status: "ok", service: "compiler-backend" }));
app.use('/practice', compilerRouter);
export { app };
