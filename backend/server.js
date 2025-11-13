"use strict";

import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log("--------------------------------");
	console.log(`My WebServer is running on port ${port}`);
});

console.log(process.env.NODE_ENV);

process.on('SIGINT', () => {
	server.close(async() => {
		await mongoose.disconnect();
		console.log(`Disconnected DB!`);
		console.log(`Exit Server Express`);
		process.exit(0);
	});
});

process.on("unhandleRejection", (err) => {
	console.log(err.name, err.message);
	console.log("UnhandleRejection Shutting down application");
	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	console.log("uncaughtException Shutting down application");
	console.log(err.name, err.message);
	process.exit(1);
});