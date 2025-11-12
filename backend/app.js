"use strict";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { nftRoutes } from "./routes/nftsRoute.js";
import { userRoutes } from "./routes/usersRoute.js";

import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// INIT MIDDLEWARE.
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(
	cors({
		origin: "http://localhost:5001",
		credentials: true
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if(process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}


// INIT DATABASE.
import instanceDB from "./database/connectDB.js";

// SERVING TEMPLATE DEMO.
app.use(express.static(`${__dirname}/nft-data/img`));

// INIT ROUTES.
app.use("/api/v1/nfts", nftRoutes);
app.use("/api/v1/users", userRoutes);

// HANDLING ERROR.
app.use((request, response, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use((err, request, response, next) => {
	const statusCode = err.status || 500;
	return response.status(statusCode).json({
		status: "error",
		code: statusCode,
		stack: err.stack,
		message: err.message || "Internal Server Error"
	})
});

export default app;