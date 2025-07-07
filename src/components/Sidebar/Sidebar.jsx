import React, { useContext, useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import HelpModal from "../HelpModal";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const { 
    onSent, 
    prevPrompts, 
    setRecentPrompt, 
    newChat, 
    chatHistory, 
    loadChatHistory, 
    isAuthenticated,
    deleteChatFromBackend
  } = useContext(Context);

  // Load chat history when component mounts or when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadChatHistory();
    }
  }, [isAuthenticated, loadChatHistory]);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the loadPrompt function
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChatFromBackend(chatId);
    }
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt=""
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {isAuthenticated && chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => {
                return (
                  <div
                    key={chat._id || index}
                    onClick={() => loadPrompt(chat.prompt)}
                    className="recent-entry"
                  >
                    <img src={assets.message_icon} alt="" />
                    <p>{chat.prompt.slice(0, 18)} ...</p>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="delete-btn"
                      title="Delete chat"
                    >
                      ×
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="recent-entry">
                <img src={assets.message_icon} alt="" />
                <p>No recent chats</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div
          className="bottom-item recent-entry hover:bg-gray-200 transition-colors"
          onClick={() => setIsHelpModalOpen(true)}
        >
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
