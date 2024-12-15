import express from "express";
import cors from "cors";
import type { Express, Request, Response, NextFunction } from "express";
import "dotenv/config";
import router from "./routes/route";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";

const server: Express = express();

connectDB();

// Read data from the request body
server.use(express.json());
server.use(express.urlencoded({ limit: "100mb", extended: true }));

// Cors configuration
server.use(cors(corsConfig));

// Request logging middleware
server.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.url} - ${new Date().toString()}`);
  next();
});

// Routes
server.use("/", router);

// Error handler
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).jsonp({ error: "Internal server error!" });
});

export default server;
