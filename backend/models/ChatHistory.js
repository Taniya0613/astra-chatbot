import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  response: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for faster queries
chatHistorySchema.index({ userId: 1, timestamp: -1 });
chatHistorySchema.index({ userId: 1, isFavorite: 1 });

// Add pagination plugin
chatHistorySchema.plugin(mongoosePaginate);

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory; 