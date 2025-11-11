import mongoose from "mongoose";

const DOCUMENT_NAME = "NFT";
const COLLECTION_NAME = "NFTs";

const nftSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A NFT must have a name"],
		unique: true,
		trim: true,
	},
	duration: {
		type: String,
		required: [true, "must provide duration"],
	},
	maxGroupSize: {
		type: Number,
		required: [true, "must have a group size"],
	},
	difficulty: {
		type: String,
		required: [true, "must have difficulty"],
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, "A NFT must have a price"]
	},
	summary: {
		type: String,
		trim: true,
		required: [true, "must provide the summary"]
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		required: [true, "must provide the cover image"],
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date]
}, {
	collection: COLLECTION_NAME,
	timestamps: true
});

const NFT = mongoose.model(DOCUMENT_NAME, nftSchema);
export { NFT };