import mongoose from "mongoose";

const DOCUMENT_NAME = "NFT";
const COLLECTION_NAME = "NFTs";

const nftSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A NFT must have a name"],
		unique: true,
	},
	rating: {
		type: Number,
		default: 4.5,
	},
	price: {
		type: Number,
		required: [true, "A NFT must have a price"]
	}
}, {
	collection: COLLECTION_NAME,
	timestamps: true
});

const NFT = mongoose.model(DOCUMENT_NAME, nftSchema);
export { NFT };