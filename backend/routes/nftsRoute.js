import express from "express";
import { 
	getAllNfts, 
	getSingleNFT, 
	createNFT, 
	updateNFT, 
	deleteNFT,
	aliasTopNFTs,
	// checkId,
	// checkBody
} from "../controllers/nftControllers.js";
const router = express.Router();

// router.param("id", checkId);

// TOP 5 NFTs BY PRICE.
router.get("/top-5-nfts", aliasTopNFTs, getAllNfts);

// ROUTES.
router.get("/", getAllNfts);
router.post("/", createNFT);

router.get("/:id", getSingleNFT);
router.patch("/:id", updateNFT);
router.delete("/:id", deleteNFT);

export { router as nftRoutes };