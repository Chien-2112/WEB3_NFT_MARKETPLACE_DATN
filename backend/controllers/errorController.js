import {AppError} from "../utils/appError.js";

// GLOBAL ERROR HANDLING.
const sendErrorDev = (err, response) => {
	response.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
}

const sendErrorPro = (err, response) => {
	if(err.isOperational) {
		response.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		response.status(500).json({
			status: "error",
			message: "Something went very wrong",
		})
	}
}

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}`;

	return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
	const value = err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/);
	// console.log(value);
	const message = `Duplicate field values ${value}. Please use another`;
	return new AppError(message, 400);
}

const handleValidationError = (err) => {
	const errors = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input Data.${errors.join(". ")}`;

	return new AppError(message, 400);
}

export const globalErrorHandler = (err, request, response, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if(process.env.NODE_ENV === "development") {
		sendErrorDev(err, response);
	} else if(process.env.NODE_ENV === "production") {
		let error = {...err};
		if(error.name === "CastError") error = handleCastErrorDB(error);
		if(error.code === 11000) error = handleDuplicateFieldsDB(error);
		if(error.name === "ValidationError") error = handleValidationError(error);

		sendErrorPro(err, response);
	}
	next();
};