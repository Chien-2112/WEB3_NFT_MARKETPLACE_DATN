import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { NFT } from "../models/nftsModel.js";
import mongoose from "mongoose";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
// import { Ap}

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
const createNFT = catchAsync(async(request, response) => {
	const newNFT = await NFT.create(request.body);
	response.status(201).json({
		status: "success",
		data: {
			nft: newNFT
		}
	});
});

// GET SINGLE NFT.
const getSingleNFT = catchAsync(async(request, response) => {
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
});

// UPDATE NFT.
const updateNFT = catchAsync(async(request, response) => {
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
});

// DELETE NFT.
const deleteNFT = catchAsync(async(request, response) => {
	const nft = await NFT.findByIdAndDelete(request.params.id);

	if (!nft) {
		return response.status(404).json({ 
			status: "fail", 
			message: "NFT not found" 
		});
	}
	response.status(204).json({
		status: "success",
		data: null,
	});
});

// AGGREGATION PIPELINE.
const getNFTsStats = catchAsync(async(request, response) => {
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
})

// CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN
const getMonthlyPlan = catchAsync(async(request, response) => {
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
});

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