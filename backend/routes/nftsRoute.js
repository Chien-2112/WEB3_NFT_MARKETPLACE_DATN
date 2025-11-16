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
} from "../controllers/nftControllers.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();

// router.param("id", checkId);

// TOP 5 NFTs BY PRICE.
router.get("/top-5-nfts", aliasTopNFTs, getAllNfts);

// STATS ROUTE.
router.route("/nfts-stats").get(getNFTsStats);

// GET MONTHLY PLAN
router.route("/monthly-plan/:year").get(getMonthlyPlan);

// ROUTES.
router.get("/", protect, getAllNfts);
router.post("/", protect, restrictTo("admin", "creator"), createNFT);

router.get("/:id", getSingleNFT);
router.patch("/:id", protect, restrictTo("admin", "creator"), updateNFT);
router.delete("/:id", protect, restrictTo("admin", "guide"), deleteNFT);

export { router as nftRoutes };