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
import { AppError } from "./utils/appError.js";
import { globalErrorHandler } from "./controllers/errorController.js";

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

app.use((request, response, next) => {
	request.requestTime = new Date().toISOString();
	next();
})

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
// app.use((request, response, next) => {
// 	const err = new Error("Not Found");
// 	err.status = 404;
// 	next(err);
// });

app.all(/.*/, (req, res, next) => {
	// res.status(404).json({
	//   status: 'fail',
	//   message: `Cannot find ${req.originalUrl} on this server!`
	// });

	// const err = new Error(`Can't find ${request.originalUrl} on this server`);
	// err.status = "fail";
	// err.statusCode = 404;
	// next(err);

	next(new AppError(`Can't find ${request.originalUrl} on this server`, 404));
});



export default app;