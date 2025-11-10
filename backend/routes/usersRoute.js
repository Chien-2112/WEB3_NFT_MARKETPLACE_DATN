import express from "express";

const router = express.Router();

const getAllUsers = (request, response) => {
	response.status(500).json({
		status: "error",
		message: "Internal server error",
	});
}
const getSingleUser = (request, response) => {
	response.status(500).json({
		status: "error",
		message: "Internal server error",
	});
}
const createUser = (request, response) => {
	response.status(500).json({
		status: "error",
		message: "Internal server error",
	});
}
const updateUser = (request, response) => {
	response.status(500).json({
		status: "error",
		message: "Internal server error",
	});
}
const deleteUser = (request, response) => {
	response.status(500).json({
		status: "error",
		message: "Internal server error",
	});
}

router.get("/", getAllUsers);
router.post("/", createUser);

router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export { router as userRoutes };