// Mongoose schema for storing chat history entries
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the schema for a chat history entry
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
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
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by user and timestamp
chatHistorySchema.index({ userId: 1, timestamp: -1 });
chatHistorySchema.index({ userId: 1, isFavorite: 1 });

// Add pagination plugin
chatHistorySchema.plugin(mongoosePaginate);

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory; 