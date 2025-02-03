import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * 用户接口
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'comedian' | 'organizer';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * 用户模型
 */
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    maxlength: [50, '用户名不能超过50个字符']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, '密码至少需要6个字符']
  },
  role: {
    type: String,
    enum: ['comedian', 'organizer'],
    default: 'comedian'
  }
}, {
  timestamps: true
});

// 添加索引
userSchema.index({ email: 1 });

/**
 * 密码加密中间件
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * 密码比较方法
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.models.User || 
  mongoose.model<IUser>('User', userSchema); 