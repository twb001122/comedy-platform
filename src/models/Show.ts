import mongoose from 'mongoose';

/**
 * 演出信息模型
 */
const showSchema = new mongoose.Schema({
  // 发布者ID
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 演出名称
  title: {
    type: String,
    required: true
  },
  // 演出性质
  type: {
    type: String,
    required: true,
    enum: ['commercial', 'business', 'variety', 'film', 'scriptwriting', 'other']
  },
  // 演出地点
  location: {
    type: String,
    required: true
  },
  // 是否面议
  isPriceNegotiable: {
    type: Boolean,
    required: true,
    default: true
  },
  // 报酬金额
  price: {
    type: Number,
    required: function(this: any) {
      return !this.isPriceNegotiable;
    }
  },
  // 演出详情
  description: {
    type: String,
    required: true
  },
  // 截止日期
  deadline: {
    type: Date,
    required: true
  },
  // 联系方式
  contact: {
    type: String,
    required: true
  },
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新更新时间
showSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Show = mongoose.models.Show || mongoose.model('Show', showSchema); 