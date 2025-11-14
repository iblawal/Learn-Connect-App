import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  profileCompleted?: boolean;
  school?: string;
  course?: string;
  isVerified?: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true 
    },
    phone: {
      type: String,
      default: null
    },
    avatar: { 
      type: String,
      default: null
    },
    profileCompleted: { 
      type: Boolean, 
      default: false 
    },
    school: { 
      type: String,
      default: null
    },
    course: { 
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      default: undefined
    },
    verificationCodeExpires: {
      type: Date,
      default: undefined
    }
  },
  { 
    timestamps: true 
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);