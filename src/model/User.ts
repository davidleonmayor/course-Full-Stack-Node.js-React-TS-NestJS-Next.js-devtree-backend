import { Schema, model } from "mongoose";
import type { Document, Types } from "mongoose";

export interface IUser extends Document {
  handle: string;
  name: string;
  email: string;
  password: string;
  description: string;
  image: string;
  links: string;
}

const UserSchema = new Schema<IUser>({
  handle: {
    type: String,
    require: [true, "Handle required"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  image: {
    type: String,
    trim: true,
    default: "",
  },
  links: {
    type: String,
    trim: true,
    default: "[]",
  },
});

// TODO: move to auto-execute previously saved
// UserSchema.pre("save", async function (next) {
//   let usr = this;
//   if (!usr.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(config.get("saltFactor"));
//   const hash = await bcrypt.hash(usr.password, salt); // Usar bcrypt.hash en lugar de bcrypt.hashSync

//   usr.password = hash;

//   return next();
// });

const User = model<IUser>("User", UserSchema);

export default User;
