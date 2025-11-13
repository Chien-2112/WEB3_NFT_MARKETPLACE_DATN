import express from "express";
import { signIn, signUp } from "../controllers/authController.js";
import {
	getAllUsers,
	getSingleUser,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);


router.get("/", getAllUsers);
router.post("/", createUser);

router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export { router as userRoutes };