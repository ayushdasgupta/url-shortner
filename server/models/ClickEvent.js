import mongoose from 'mongoose'

const clickEventSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  device: {
    type: String
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  location: {
    country: String,
    city: String
  }
});

clickEventSchema.index({ linkId: 1, timestamp: -1 });

const ClickEvent = mongoose.model('ClickEvent', clickEventSchema);

export default ClickEvent