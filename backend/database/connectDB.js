
"use strict";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectString = process.env.URL_MONGODB;

class Database {
	constructor() {
		this.connectDB();
	}

	// ConnectDB
	connectDB(type = "mongodb") {
		if(process.env.NODE_ENV === "development") {
			mongoose.set("debug", true);
			mongoose.set("debug", { color: true });
		}
		mongoose.connect(connectString, {
			maxPoolSize: 50
		})
			.then(() => {
				console.log("Connected MongoDB Success!");
			})
			.catch((err) => console.log(`Error Connect: `, err))
	}
	static getInstance() {
		if(!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}
}

const instanceDB = Database.getInstance();
export default instanceDB; 