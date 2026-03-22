import bcrypt from "bcrypt";
import { Schema } from "mongoose";
import dbConnection from "../config/database.config";
import { ROLES } from "../constants";
import { IUser } from "../types";

const validRoles = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN];

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Please enter user name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    isUserActive: {
      type: Boolean,
      default: false,
    },
    uniqueString: {
      type: String,
    },
    role: {
      type: String,
      enum: validRoles,
      default: ROLES.USER,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.uniqueString;
  delete user.__v;
  return user;
};

UserSchema.methods.isUserPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserModel = dbConnection.model<IUser>("User", UserSchema);

export default UserModel;
