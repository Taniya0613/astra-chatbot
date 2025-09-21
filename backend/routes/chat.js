// Express routes for chat-related API endpoints
import express from 'express';
import { 
  saveChat, 
  getChatHistory, 
  getRecentChats, 
  toggleFavorite, 
  deleteChat 
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validate.js';

const router = express.Router();

// Validation rules for saving a chat
const validateSaveChat = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required'),
  body('response')
    .trim()
    .notEmpty()
    .withMessage('Response is required')
];

// All routes below require authentication
router.use(protect);

// Save chat prompt and response
router.post('/save', validateSaveChat, handleValidationErrors, saveChat);

// Get chat history with pagination
router.get('/history', getChatHistory);

// Get recent chats for sidebar
router.get('/recent', getRecentChats);

// Toggle favorite status
router.patch('/:id/favorite', toggleFavorite);

// Delete chat entry
router.delete('/:id', deleteChat);

export default router; 