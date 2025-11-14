import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  profileCompleted?: boolean;
  school?: string;
  course?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<IUser>("User", UserSchema);