// Root App component. Sets up routing, authentication modal, and global modals.
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import AuthModal from "./components/AuthModal/AuthModal";
import { Context } from "./context/context";
import Activity from "./components/modals/Activity";
import Settings from "./components/modals/Settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  // State for showing/hiding modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // Get authentication and chat history functions from context
  const { isAuthenticated, setIsAuthenticated, loadChatHistory } =
    useContext(Context);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
      loadChatHistory();
    } else {
      // Show auth modal after 5 seconds only if not authenticated
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [setIsAuthenticated, loadChatHistory]);

  // Handlers for opening/closing modals
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleOpenActivityModal = () => {
    setIsActivityModalOpen(true);
    setIsSettingsModalOpen(false);
  };

  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
    setIsActivityModalOpen(false);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <Router basename="/astra-chatbot">
      <Sidebar
        onOpenActivityModal={handleOpenActivityModal}
        onOpenSettingsModal={handleOpenSettingsModal}
      />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
      <Activity
        isOpen={isActivityModalOpen}
        onClose={handleCloseActivityModal}
      />
      <Settings
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
      />
      <AuthModal
        isOpen={showAuthModal && !isAuthenticated}
        onClose={handleCloseAuthModal}
      />
    </Router>
  );
};

export default App;
