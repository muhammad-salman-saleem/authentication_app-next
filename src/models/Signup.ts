import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Signup extends Document {
  firstName: string;
  lastName: string;
  occupation: string;
  mobile: number;
  email: string;
  password: string;
  user_authentication: string | null;
  user_verification_code: number;
  isAdmin: boolean;
  admin_is_verified:number;
  avatarImage: string;
}

const SignupSchema: Schema = new Schema({
  avatarImage: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastName: { type: String, required: true },
  occupation: { type: String, required: true },
  mobile: { type: Number, required: true },
  user_authentication: {
    type: String,
    require: false,
    default: null,
  },
  user_verification_code: {
    type: Number,
    require: false,
    trim: true,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    require: false,
    default: false,
  },
  isPartner: {
    type: Boolean,
    require: false,
    default: false,
  },
  isDeveloper: {
    type: Boolean,
    require: false,
    default: false,
  },
  is_verified: {
    type: Number,
    default: false,
    trim: true,
  },
});

SignupSchema.methods.toJSON = function () {
  const admin = this as Signup;
  const userObject = admin.toObject();

  delete userObject.password;
  delete userObject.user_authentication;

  return userObject;
};

SignupSchema.methods.generateAuthToken = async function () {
  const user = this as Signup;
  const token = jwt.sign(
    { _id: user._id.toString() },
    "D332Qt0HVqpTG4QRvw991YbIAO8rVvxDtKWozRvD"
  );
  user.user_authentication = token;
  await user.save();
  return token;
};

SignupSchema.pre("save", async function (next) {
  const user = this as Signup;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const modelName = "User";

const SignupModel =
  mongoose.models[modelName] || mongoose.model<Signup>(modelName, SignupSchema);

export default SignupModel;
