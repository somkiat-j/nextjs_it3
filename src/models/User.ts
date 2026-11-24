import mongoose, { Schema, models } from "mongoose";
const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "user"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default models.User || mongoose.model("User", UserSchema);
