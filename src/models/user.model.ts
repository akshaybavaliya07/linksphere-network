import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface User extends Document {
  name: string;
  bio: string;
  password: string;
  email: string;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpires: Date;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  bio: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use valid email"],
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpires: {
    type: Date,
  },
});

UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(this.password, password);
};

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
