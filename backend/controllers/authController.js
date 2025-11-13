
import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

// CREATE TOKEN
const signToken = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
}

// SIGNUP.
const signUp = catchAsync(async(request, response, next) => {
	const { name, email, password, passwordConfirm } = request.body; 
	const newUser = await User.create({
		name, email, password, passwordConfirm
	});

	const token = signToken(newUser._id);

	response.status(201).json({
		status: "Success",
		token,
		data: {
			user: newUser,
		}
	});
});

// SIGNIN
const signIn = catchAsync(async(request, response, next) => {
	const { email, password } = request.body;
	if(!email || !password) {
		return next(new AppError("Please provide your email & password"));
	}

	const user = await User.findOne({ email }).select("+password");
	if(!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email and password", 401));
	}

	const token = signToken(user.id);
	response.status(200).json({
		status: "success",
		token,
	})
});

// PROTECTING DATA.
const protect = catchAsync(async(request, response, next) => {
	// 1 Check token
	let token;
	if(request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
		token = request.headers.authorization.split(" ")[1];
		console.log(token);
	}
	if(!token) {
		return next(new AppError("You are not logged in to get access", 401));
	}
	// 2 Validate token
	// 3 User exist
	// 4 Change password
	next();
})

export { signUp, signIn, protect };