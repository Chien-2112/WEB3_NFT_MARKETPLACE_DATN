import fs from "fs";
import express from "express";
import morgan from "morgan";
import { nftRoutes } from "./routes/nftsRoute.js";
import { userRoutes } from "./routes/usersRoute.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// CUSTOM MIDDLEWARE.
app.use((request, response, next) => {
	response.requestTime = new Date().toISOString();
	next();
});

app.use("/api/v1/nfts", nftRoutes);
app.use("/api/v1/users", userRoutes);

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
})