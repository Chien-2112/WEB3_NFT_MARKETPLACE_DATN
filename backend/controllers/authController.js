
import {promisify} from "util";
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
	const { name, email, password, passwordConfirm, role } = request.body; 
	const newUser = await User.create({
		name, email, password, passwordConfirm, role,
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
	const verifyAsync = promisify(jwt.verify);
	const decoded = await verifyAsync(token, process.env.JWT_SECRET);
	console.log(decoded);
	// 3 User exist
	const currentUser = await User.findById(decoded.id);
	if(!currentUser) {
		return next(new AppError("The user belonging to this token does no longer exist.", 401));
	}
	// 4 Change password.
	if(currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError("User recently changed password! Please log in again.", 401));
	}
	request.user = currentUser;
	next();
});

// AUTHORIZE ROLES.
const restrictTo = (...roles) => {
	return (request, response, next) => {
		if (!roles.includes(request.user.role)) {
			return next(
				new AppError("You do not have permission to perform this action", 403)
			);
		}
		next();
	};
};

// FORGOT PASSWORD.
const forgotPassword = catchAsync(async(request, response, next) => {
	const user = await User.findOne({ email: request.body.email });
	if(!user) {
		return next(new AppError("There is no user with email address.", 404));
	}
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });
	
	response.status(200).json({
		status: "success",
		message: "Token sent to email",
	});
});

// RESET PASSWORD.
const resetPassword = catchAsync(async(request, response, next) => {
	const user = await User.findOne({ email: request.body.email });
	if(!user) {
		return next(new AppError("There is no user with email address.", 404));
	}
});

export { signUp, signIn, protect, restrictTo, forgotPassword, resetPassword };