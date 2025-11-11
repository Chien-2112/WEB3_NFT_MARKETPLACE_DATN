import express from "express";
import { 
	getAllNfts, 
	getSingleNFT, 
	createNFT, 
	updateNFT, 
	deleteNFT,
	// checkId,
	// checkBody
} from "../controllers/nftControllers.js";
const router = express.Router();

// router.param("id", checkId);

// ROUTES.
router.get("/", getAllNfts);
router.post("/", createNFT);

router.get("/:id", getSingleNFT);
router.patch("/:id", updateNFT);
router.delete("/:id", deleteNFT);

export { router as nftRoutes };