import mongoose, { Schema, Document } from 'mongoose';

/**
 * 演员资料卡接口
 */
export interface IComedianProfile extends Document {
  userId: string;
  location: {
    province: string;
    city: string;
  };
  avatar: string;
  photos: string[];
  stageName: string;
  experience: number;
  hasClub: boolean;
  clubName?: string;
  bio: string;
  contact: string;
  hasCommercialExp: boolean;
  hasScriptwritingExp: boolean;
  hasPersonalShow: boolean;
  personalShows?: string[];
  hasVarietyExp: boolean;
  varietyShows?: string[];
  isPriceNegotiable: boolean;
  commercialFee?: number;
  jointShowFee?: number;
  personalShowFee?: number;
  scriptwritingFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 演员资料卡模型
 */
const comedianProfileSchema = new Schema<IComedianProfile>({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  location: {
    type: {
      province: { type: String },
      city: { type: String }
    },
    _id: false
  },
  avatar: { 
    type: String
  },
  photos: {
    type: [String],
    validate: {
      validator: function(photos: string[] | undefined) {
        if (!photos) return true;
        if (!Array.isArray(photos)) return false;
        return photos.length <= 5;
      },
      message: '相册最多只能包含5张照片'
    }
  },
  stageName: { 
    type: String, 
    required: true,
    maxlength: [50, '艺名不能超过50个字符']
  },
  experience: { 
    type: Number,
    min: [0, '表演经验不能为负数']
  },
  hasClub: { 
    type: Boolean, 
    default: false 
  },
  clubName: { 
    type: String,
    maxlength: [100, '俱乐部名称不能超过100个字符']
  },
  bio: { 
    type: String,
    maxlength: [1000, '个人简介不能超过1000个字符']
  },
  contact: { 
    type: String,
    maxlength: [200, '联系方式不能超过200个字符']
  },
  hasCommercialExp: {
    type: Boolean,
    default: false
  },
  hasScriptwritingExp: {
    type: Boolean,
    default: false
  },
  hasPersonalShow: {
    type: Boolean,
    default: false
  },
  personalShows: {
    type: [String]
  },
  hasVarietyExp: {
    type: Boolean,
    default: false
  },
  varietyShows: {
    type: [String]
  },
  isPriceNegotiable: { 
    type: Boolean, 
    default: false 
  },
  commercialFee: { 
    type: Number,
    min: [0, '价格不能为负数']
  },
  jointShowFee: { 
    type: Number,
    min: [0, '价格不能为负数']
  },
  personalShowFee: { 
    type: Number,
    min: [0, '价格不能为负数']
  },
  scriptwritingFee: { 
    type: Number,
    min: [0, '价格不能为负数']
  }
}, {
  timestamps: true
});

export const ComedianProfile = mongoose.models.ComedianProfile || 
  mongoose.model<IComedianProfile>('ComedianProfile', comedianProfileSchema); 