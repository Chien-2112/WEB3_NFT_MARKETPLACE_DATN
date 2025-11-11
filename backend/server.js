"use strict";

import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log("--------------------------------");
	console.log(`My WebServer is running on port ${port}`);
})

process.on('SIGINT', () => {
	server.close(async() => {
		await mongoose.disconnect();
		console.log(`Disconnected DB!`);
		console.log(`Exit Server Express`);
		process.exit(0);
	})
})