import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { NFT } from "../models/nftsModel.js";
import mongoose from "mongoose";
import { APIFeatures } from "../utils/apiFeatures.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nfts = JSON.parse(
	fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

const aliasTopNFTs = (request, response, next) => {
	request.query.limit = '5';
	request.query.sort = "-ratingsAverage,price";
	request.query.fields = "name,price,ratingsAverage,difficulty";
	console.log('Top NFT Query:', request.query);
	next();
}
// GET ALL NFTs.
const getAllNfts = async (request, response) => {
	try {
		const features = new APIFeatures(NFT.find(), request.query)
			.filter()
			.sort()
			.limitFields()
			.pagination();
		const nfts = await features.query;

		response.status(200).json({
			status: "success",
			results: nfts.length,
			data: {
				nfts,
			},
		});
	} catch(error) {
		response.status(404).json({
			status: "fail",
			message: error.message,
		});
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
		const { id } = request.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return response.status(400).json({ 
				status: "fail", 
				message: "Invalid ID" 
			});
		  }
		const nft = await NFT.findById(id);
		if (!nft) {
			return response.status(404).json({ 
				status: "fail", 
				message: "NFT not found" 
			});
		}
		response.status(200).json({
			status: "success",
			data: {
				nft
			}
		})
	} catch(error) {
		response.status(500).json({ 
			status: "error", 
			message: error.message 
		});
	}
};

// UPDATE NFT.
const updateNFT = async(request, response) => {
	try {
		const nft = await NFT.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ new: true, runValidators: true }
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
		await NFT.findByIdAndDelete(request.params.id);
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

// AGGREGATION PIPELINE.
const getNFTsStats = async(request, response) => {
	try {
		const stats = await NFT.aggregate([
			{
				$match: {ratingsAverage: { $gte: 4.5 }},
			},
			{
				$group: {
					// _id: "$ratingsAverage",
					_id: { $toUpper: "$difficulty" },
					num: {$sum: 1},
					numRatings: {$sum: "$ratingsQuantity"},
					avgRating: {$avg: "$ratingsAverage"},
					avgPrice: {$avg: "$price"},
					minPrice: {$min: "$price"},
					maxPrice: {$max: "$price"},
				},
			},
			{
				$sort: {avgRating: 1}
			},
			{
				$match: {
					_id: { $ne: "EASY" }
				}
			}
		]);
		response.status(200).json({
			status: "success",
			data: {
				stats
			},
		});
	} catch(error) {
		response.status(404).json({
			status: "fail",
			message: error,
		})
	}
}

// CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN
const getMonthlyPlan = async(request, response) => {
	try {
		const year = request.params.year * 1;
		const plan = await NFT.aggregate([
			{
				$unwind: "$startDates",
			},
			{
				$match: {
					startDates: {
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`),
					}
				}
			},
			{
				$group: {
					_id: {$month: "$startDates"},
					numNFTStarts: {$sum: 1},
					nfts: {$push: "$name"},
				},
			},
			{
				$addFields: {
					month: "$_id"
				}
			},
			{
				$project: {
					_id: 1
				}
			},
			{
				$sort: {
					numNFTStarts: -1
				}
			},
			{
				$limit: 6,
			}
		]);
		response.status(200).json({
			status: "success",
			data: plan,
		})
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
	aliasTopNFTs,
	getNFTsStats,
	getMonthlyPlan,
};