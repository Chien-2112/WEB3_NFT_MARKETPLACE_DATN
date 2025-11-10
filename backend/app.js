const express = require("express");

const app = express();

// app.get("/", (request, response) => {
// 	response.status(200).json({ 
// 		message: "Hello world!",
// 		api: "NFT Marketplace",
// 	});
// });

// app.post("/", (request, response) => {
// 	response.status(201).json({
// 		message: "Your data",
// 	})
// })

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
})