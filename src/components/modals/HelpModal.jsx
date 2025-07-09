import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/assets";

const HelpModal = ({ isOpen, onClose }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("guide");

  const faqs = [
    {
      question: "How do I start a new chat?",
      answer:
        "Click the 'New Chat' button at the top of the sidebar or use the suggestion cards on the main screen.",
    },
    {
      question: "Can I upload images?",
      answer:
        "Yes, you can upload images using the gallery icon in the input box at the bottom of the chat. Supported formats include JPG, PNG, and GIF.",
    },
    {
      question: "How do I use voice input?",
      answer:
        "Click the microphone icon next to the input box to start voice recording. Speak clearly, and your words will be converted to text. Click again to stop recording.",
    },
    {
      question: "What can I ask Astra?",
      answer:
        "You can ask Astra about anything! From code help to travel recommendations, creative ideas to explanations of complex topics. Try using the suggestion cards for inspiration.",
    },
    {
      question: "How do I clear my chat history?",
      answer:
        "You can clear your chat history by clicking the 'New Chat' button to start fresh, or use the Activity section to manage your previous conversations.",
    },
  ];

  const features = [
    {
      icon: assets.plus_icon,
      title: "New Chat",
      description: "Start a fresh conversation",
    },
    {
      icon: assets.mic_icon,
      title: "Voice Input",
      description: "Speak your messages",
    },
    {
      icon: assets.gallery_icon,
      title: "Image Upload",
      description: "Share images for analysis",
    },
    {
      icon: assets.message_icon,
      title: "Smart Responses",
      description: "Get AI-powered answers",
    },
  ];

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@astra.ai?subject=Help%20Request";
  };

  const handleDocumentation = () => {
    // You can replace this with your actual documentation URL
    window.open("https://docs.astra.ai", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Help Center
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-6">
              {["guide", "faqs", "support"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {/* Quick Start Guide */}
              {activeTab === "guide" && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Quick Start Guide
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img src={feature.icon} alt="" className="w-6 h-6" />
                          <h4 className="font-medium text-gray-800">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* FAQs */}
              {activeTab === "faqs" && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-2">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden"
                      >
                        <button
                          className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                          onClick={() =>
                            setExpandedFaq(expandedFaq === index ? null : index)
                          }
                        >
                          <span className="font-medium text-gray-800">
                            {faq.question}
                          </span>
                          <span className="transform transition-transform duration-200">
                            {expandedFaq === index ? "−" : "+"}
                          </span>
                        </button>
                        <AnimatePresence>
                          {expandedFaq === index && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="p-4 text-gray-600 bg-white">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Support Options */}
              {activeTab === "support" && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Need More Help?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleEmailSupport}
                      className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left group"
                    >
                      <h4 className="font-medium text-purple-800 mb-1 group-hover:text-purple-900">
                        Email Support
                      </h4>
                      <p className="text-sm text-purple-600">
                        Get help from our support team
                      </p>
                    </button>
                    <button
                      onClick={handleDocumentation}
                      className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left group"
                    >
                      <h4 className="font-medium text-blue-800 mb-1 group-hover:text-blue-900">
                        Documentation
                      </h4>
                      <p className="text-sm text-blue-600">
                        Read our detailed guides
                      </p>
                    </button>
                  </div>
                </motion.section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
