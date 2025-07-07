import ChatHistory from '../models/ChatHistory.js';

// @desc    Save chat prompt and response
// @route   POST /api/chat/save
// @access  Private
export const saveChat = async (req, res) => {
  try {
    const { prompt, response } = req.body;
    const userId = req.user.id;

    if (!prompt || !response) {
      return res.status(400).json({
        success: false,
        message: 'Prompt and response are required'
      });
    }

    const chatEntry = await ChatHistory.create({
      userId,
      prompt,
      response
    });

    res.status(201).json({
      success: true,
      message: 'Chat saved successfully',
      data: {
        id: chatEntry._id,
        prompt: chatEntry.prompt,
        response: chatEntry.response,
        timestamp: chatEntry.timestamp,
        isFavorite: chatEntry.isFavorite
      }
    });
  } catch (error) {
    console.error('Save chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving chat',
      error: error.message
    });
  }
};

// @desc    Get user's chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, favorite = false } = req.query;

    const query = { userId };
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { timestamp: -1 },
      select: 'prompt response timestamp isFavorite tags'
    };

    const chatHistory = await ChatHistory.paginate(query, options);

    res.status(200).json({
      success: true,
      data: {
        chats: chatHistory.docs,
        pagination: {
          currentPage: chatHistory.page,
          totalPages: chatHistory.totalPages,
          totalDocs: chatHistory.totalDocs,
          hasNextPage: chatHistory.hasNextPage,
          hasPrevPage: chatHistory.hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat history',
      error: error.message
    });
  }
};

// @desc    Get recent chat history (for sidebar)
// @route   GET /api/chat/recent
// @access  Private
export const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const recentChats = await ChatHistory.find({ userId })
      .select('prompt timestamp isFavorite')
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        chats: recentChats
      }
    });
  } catch (error) {
    console.error('Get recent chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent chats',
      error: error.message
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/chat/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatEntry = await ChatHistory.findOne({ _id: id, userId });

    if (!chatEntry) {
      return res.status(404).json({
        success: false,
        message: 'Chat entry not found'
      });
    }

    chatEntry.isFavorite = !chatEntry.isFavorite;
    await chatEntry.save();

    res.status(200).json({
      success: true,
      message: `Chat ${chatEntry.isFavorite ? 'added to' : 'removed from'} favorites`,
      data: {
        id: chatEntry._id,
        isFavorite: chatEntry.isFavorite
      }
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating favorite status',
      error: error.message
    });
  }
};

// @desc    Delete chat entry
// @route   DELETE /api/chat/:id
// @access  Private
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatEntry = await ChatHistory.findOneAndDelete({ _id: id, userId });

    if (!chatEntry) {
      return res.status(404).json({
        success: false,
        message: 'Chat entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting chat entry',
      error: error.message
    });
  }
}; 