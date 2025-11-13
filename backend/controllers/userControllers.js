// ---- USERS.
import { User } from "../models/usersModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

const getAllUsers = catchAsync(async(request, response) => {
	const users = await User.find();

	response.status(500).json({
		status: "error",
		results: users.length,
		data: {
			users,
		}
	});
});

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

export { getAllUsers, getSingleUser, createUser, updateUser, deleteUser };