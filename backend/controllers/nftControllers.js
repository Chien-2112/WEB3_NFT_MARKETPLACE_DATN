import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { NFT } from "../models/nftsModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nfts = JSON.parse(
	fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

// MIDDLEWARE.
// const checkId = (request, response, next, value) => {
// 	console.log(`ID: ${value}`);
// 	if(request.params.id * 1 > nfts.length) {
// 		return response.status(404).json({
// 			status: "fail",
// 			message: "Invalid ID",
// 		});
// 	};
// 	next();
// }

// const checkBody = (request, response, next) => {
// 	if(!request.body.name || !request.body.price) {
// 		return response.status(400).json({
// 			status: "fail",
// 			message: "Missing name and price",
// 		});
// 	}
// 	next();
// };


// GET ALL NFTs.
const getAllNfts = async(request, response) => {
	try {
		const nfts = await NFT.find();
		response.status(200).json({
			status: "success",
			requestTime: request.requestTime,
			results: nfts.length,
			data: {
				nfts,
			},
		});
	} catch(error) {
		response.status(404).json({
			status: "fail",
			message: error,
		})
	}
};

// CREATE NFT
const createNFT = async(request, response) => {
	try {
		const newNFT = await NFT.create(request.body);
		response.status(201).json({
			status: "success",
			data: {
				nft: newNFT
			}
		})
	} catch(error) {
		response.status(400).json({
			status: "fail",
			message: "Invalid data send for NFT",
		});
	}
};

// GET SINGLE NFT.
const getSingleNFT = async(request, response) => {
	try {
		const nft = await NFT.findById({ _id: request.param.id });
		response.status(200).json({
			status: "success",
			data: {
				nft
			}
		})
	} catch(error) {
		response.status(404).json({
			status: "fail",
			message: error,
		})
	}
};

// UPDATE NFT.
const updateNFT = async(request, response) => {
	try {
		const nft = await NFT.findByIdAndUpdate(
			request.param.id,
			request.body,
			{
				new: true,
				runValidators: true,
			}
		);
		response.status(200).json({
			status: "success",
			data: {
				nft,
			}
		})
	} catch(error) {
		response.status(404).json({
			status: "fail",
			message: error
		})
	}
}

// DELETE NFT.
const deleteNFT = async(request, response) => {
	try {
		await NFT.findByIdAndDelete();
		response.status(204).json({
			status: "success",
			data: null,
		});
	} catch(error) {
		response.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

export { 
	getAllNfts, 
	getSingleNFT, 
	createNFT, 
	updateNFT, 
	deleteNFT,
};