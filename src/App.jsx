import React, { useState, useEffect, useContext } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import AuthModal from './components/AuthModal/AuthModal'
import { Context } from './context/context'

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, setIsAuthenticated, loadChatHistory } = useContext(Context);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
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

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <Sidebar/>
      <Main/>
      <AuthModal 
        isOpen={showAuthModal && !isAuthenticated} 
        onClose={handleCloseAuthModal}
      />
    </>
  )
}

export default App