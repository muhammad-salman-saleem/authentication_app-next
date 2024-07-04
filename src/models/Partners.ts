import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Signup extends Document {
  admin_id: string;
  firstName: string;
  lastName: string;
  mobile: number;
  email: string;
  password: string;
  user_authentication: string | null;
  user_verification_code: number;
  isPartner: boolean;
  admin_is_verified: number;
  avatarImage: string;
  plan_access: boolean;
  plan_creation: boolean;
}

const PartnerSchema: Schema = new Schema({
  avatarImage: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastName: { type: String, required: true },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
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

  isPartner: {
    type: Boolean,
    require: false,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    require: false,
    default: false,
  },
  isDeveloper: {
    type: Boolean,
    require: false,
    default: false,
  },
  plan_access: {
    type: Boolean,
    require: false,
    default: false,
  },
  plan_creation: {
    type: Boolean,
    require: false,
    default: false,
  },

  is_verified: {
    type: Boolean,
    default: false,
    trim: true,
  },
});

PartnerSchema.methods.toJSON = function () {
  const partner = this as Signup;
  const userObject = partner.toObject();

  delete userObject.password;
  delete userObject.user_authentication;

  return userObject;
};

PartnerSchema.methods.generateAuthToken = async function () {
  const user = this as Signup;
  const token = jwt.sign(
    { _id: user._id.toString() },
    "D332Qt0HVqpTG4QRvw991YbIAO8rVvxDtKWozRvD"
  );
  user.user_authentication = token;
  await user.save();
  return token;
};

PartnerSchema.pre("save", async function (next) {
  const user = this as Signup;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const modelName = "Partner";

const Partner =
  mongoose.models[modelName] ||
  mongoose.model<Signup>(modelName, PartnerSchema);

export default Partner;
