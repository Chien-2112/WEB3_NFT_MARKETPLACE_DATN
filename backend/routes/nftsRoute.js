import express from "express";
import { 
	getAllNfts, 
	getSingleNFT, 
	createNFT, 
	updateNFT, 
	deleteNFT,
	aliasTopNFTs,
	getNFTsStats,
	getMonthlyPlan
	// checkId,
	// checkBody
} from "../controllers/nftControllers.js";
const router = express.Router();

// router.param("id", checkId);

// TOP 5 NFTs BY PRICE.
router.get("/top-5-nfts", aliasTopNFTs, getAllNfts);

// STATS ROUTE.
router.route("/nfts-stats").get(getNFTsStats);

// GET MONTHLY PLAN
router.route("/monthly-plan/:year").get(getMonthlyPlan);

// ROUTES.
router.get("/", getAllNfts);
router.post("/", createNFT);

router.get("/:id", getSingleNFT);
router.patch("/:id", updateNFT);
router.delete("/:id", deleteNFT);

export { router as nftRoutes };