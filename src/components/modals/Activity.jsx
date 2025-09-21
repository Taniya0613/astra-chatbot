// Activity modal component. Displays user activity or chat logs in a modal popup.
import React, { useRef, useEffect } from "react";

const Activity = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  // Animation state for smooth transition
  const [show, setShow] = React.useState(false);

  // Handle show/hide animation based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setShow(false), 220);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Close modal when clicking outside the modal area
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Don't render if not open and animation is finished
  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md p-5 rounded-xl shadow bg-white flex flex-col items-center mx-2 relative transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ minWidth: 320, maxWidth: 380 }}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-2 text-center">
          Your Gemini Apps activity
        </h1>
        <p className="text-gray-600 mb-4 text-center text-sm">
          <a href="#" className="text-blue-600 underline">
            Gemini Apps
          </a>{" "}
          give you direct access to Google AI. Your chats are saved in your
          account for up to 72 hours, whether Gemini Apps activity is on or off.
        </p>
        <div className="flex items-center justify-between mb-3 w-full">
          <span className="font-medium text-base">Gemini Apps activity</span>
          <button className="px-3 py-0.5 border rounded-full text-xs font-medium">
            Turn off
          </button>
        </div>
        <div className="flex items-center mb-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-sm">
          <span className="mr-2">🗑️</span>
          <span>Deleting activity older than 18 months</span>
          <span className="ml-auto">{">"}</span>
        </div>
        <div className="flex items-center mb-4 p-2 bg-gray-100 rounded-lg w-full text-xs">
          <span className="mr-2 text-blue-600">G</span>
          <span className="text-gray-700">
            Google protects your privacy and security.
            <a href="#" className="ml-1 text-blue-600 underline">
              Manage my activity verification
            </a>
          </span>
        </div>
        <button className="border px-4 py-1 rounded text-gray-700 bg-white text-sm w-full mb-4">
          Delete ▼
        </button>
        <div className="flex flex-col items-center mb-3 w-full">
          {/* Placeholder for illustration */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto">
            <span role="img" aria-label="lock" className="text-2xl">
              🔒
            </span>
          </div>
          <span className="text-gray-500 text-xs text-center">
            To see your full history, verify that it’s you
          </span>
        </div>
        <div className="flex justify-center w-full">
          <button className="bg-blue-600 text-white px-6 py-1.5 rounded font-medium hover:bg-blue-700 transition text-sm">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Activity;
