import express from "express";
import {
	getAllUsers,
	getSingleUser,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);

router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export { router as userRoutes };