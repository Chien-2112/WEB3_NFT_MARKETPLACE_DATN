
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

export { getAllUsers, getSingleUser, createUser, updateUser, deleteUser };