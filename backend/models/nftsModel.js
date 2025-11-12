import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

const DOCUMENT_NAME = "NFT";
const COLLECTION_NAME = "NFTs";

const nftSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A NFT must have a name"],
		unique: true,
		trim: true,
		maxlength: [40, "nft must have 40 character"],
		minlength: [10, "nft must have 10 character"],
		// validate: [validator.isAlpha, "NFT name must only contain Characters"]
	},
	slug: String,
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
		enum: {
			values: ["easy", "medium", "difficulty"],
			message: "Difficulty is either: easy, medium and difficulty",
		}
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
		min: [1, "must have 1"],
		max: [5, "must have 5"],
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, "A NFT must have a price"]
	},
	priceDiscount: {
		// THIS CAN ONLY WORK AT THE TIME OF CREATE NOT UPDATE.
		type: Number,
		validate: {
			validator: function(val) {
				return val < this.price 
			},
			message: "Discount price({VALUE}) should be below regular price",
		},
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
		default: Date.now(),
		select: false,	
	},
	startDates: [Date],
	secretNFTs: {
		type: Boolean,
		default: false,
	}
}, {
	collection: COLLECTION_NAME,
	timestamps: true,
	toJSON: {virtuals: true},
	toObject: {virtuals: true},
});

// MONGOOSE VIRTUAL
nftSchema.virtual("durationWeeks").get(function(){
	return this.duration / 7;
});

nftSchema.pre("save", function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

nftSchema.pre("save", function(next){
	console.log("document will save...");
	next();
})

// nftSchema.post("save", function(doc, next){
// 	console.log(doc);
// 	next();
// })

nftSchema.pre(/^find/, function(next) {
	this.find({ secretNFTs: { $ne: true } });
	next();
});

// ----- post
nftSchema.post(/^find/, function(doc, next){
	console.log(`Query took time: ${Date.now() - this.start} times`);
	next();
});

// AGGREATION MIDDLEWARE
nftSchema.pre("aggregate", function(next){
	this.pipeline().unshift({ $match: {secretNFTs: {$ne: true}}});
	// console.log(this.pipeline());
	next();
})

const NFT = mongoose.model(DOCUMENT_NAME, nftSchema);
export { NFT };