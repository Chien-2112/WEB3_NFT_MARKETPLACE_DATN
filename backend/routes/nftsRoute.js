import express from "express";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const nfts = JSON.parse(
	fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);
// console.log(nfts);

// GET ALL NFTs.
const getAllNfts = (request, response) => {
	console.log(request.requestTime);

	response.status(200).json({
		status: "success",
		requestTime: request.requestTime,
		results: nfts.length,
		data: {
			nfts,
		},
	});
};

// CREATE NFT
const createNFT = (request, response) => {
	const newId = nfts[nfts.length - 1] + 1;
	const newNFTs = Object.assign({ id: newId }, request.body);

	nfts.push(newNFTs);
	fs.writeFile(
		`${__dirname}/nft-data/data/nft-simple.json`, 
		JSON.stringify(nfts), 
		(err) => {
			response.status(201).json({
				status: "success",
				nft: newNFTs,
			});
		}
	)
}

// GET SINGLE NFT.
const getSingleNFT = (request, response) => {
	const id = request.params.id * 1;
	const nft = nfts.find((el) => (el.id == id));

	if(!nft) {
		return response.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}
	response.status(200).json({
		status: "success",
		data: {
			nft,
		}
	})
};

// UPDATE NFT.
const updateNFT = (request, response) => {
	if(request.params.id * 1 > nfts.length) {
		return response.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}
	response.status(200).json({
		status: "success",
		data: {
			nft: "Updating nft"
		}
	})
}

// DELETE NFT.
const deleteNFT = (request, response) => {
	if(request.params.id * 1 > nfts.length) {
		return response.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}
	response.status(200).json({
		status: "success",
		data: null,
	})
}

router.get("/", getAllNfts);
router.post("/", createNFT);

router.get("/:id", getSingleNFT);
router.patch("/:id", updateNFT);
router.delete("/:id", deleteNFT);

export { router as nftRoutes };