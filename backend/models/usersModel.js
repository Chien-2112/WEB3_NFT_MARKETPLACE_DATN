import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// name, email, photo, password, passwordConfirmed.
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name"]
	},
	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	photo: {
		type: String,
	},
	photo: String,
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm you password"],
		validate: {
			validator: function(el) {
				return el == this.password 
			}
		}
	},
});

userSchema.pre("save", async function(next) {
	if(!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function(
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model("User", userSchema);
export { User };