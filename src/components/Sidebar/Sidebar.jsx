// Sidebar component for navigation and chat history. Handles help modal, activity, and settings.
import React, { useContext, useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import HelpModal from "../modals/HelpModal";
// import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ onOpenActivityModal, onOpenSettingsModal }) => {
  // State for sidebar extension and help modal
  const [extended, setExtended] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  // Get context values for chat and authentication
  const {
    onSent,
    prevPrompts,
    setRecentPrompt,
    newChat,
    chatHistory,
    loadChatHistory,
    isAuthenticated,
    deleteChatFromBackend,
    loadExistingChat,
  } = useContext(Context);

  // Load chat history when component mounts or when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadChatHistory();
    }
  }, [isAuthenticated, loadChatHistory]);

  // Handle chat deletion with confirmation
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the loadExistingChat function
    if (window.confirm("Are you sure you want to delete this chat?")) {
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
                    onClick={() => loadExistingChat(chat)}
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
        <div
          className="bottom-item recent-entry"
          onClick={onOpenActivityModal}
          style={{ cursor: "pointer" }}
        >
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div
          className="bottom-item recent-entry"
          onClick={onOpenSettingsModal}
          style={{ cursor: "pointer" }}
        >
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
