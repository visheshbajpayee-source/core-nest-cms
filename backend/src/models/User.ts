import mongoose, { Document, Schema } from 'mongoose';
import { RoleEnum } from '../common/constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(RoleEnum), default: RoleEnum.EMPLOYEE },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
