import mongoose from 'mongoose'

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    trim: true,
    sparse: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  clicks: {
    type: Number,
    default: 0
  }
},{timestamps: true});


linkSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};


linkSchema.virtual('shortUrl').get(function() {
  return `${process.env.BASE_URL || 'http://localhost:5000'}/${this.shortCode}`;
});

linkSchema.set('toJSON', { virtuals: true });
linkSchema.set('toObject', { virtuals: true });

const Link = mongoose.model('Link', linkSchema);

export default Link;