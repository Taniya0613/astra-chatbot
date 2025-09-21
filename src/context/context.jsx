// Context provider for global app state (authentication, chat, etc.)
import { createContext, use, useState, useEffect, useCallback } from "react";
import run from "../config/gemini";

export const Context = createContext();

// Utility to format markdown headings and code blocks for chat responses
function formatHeadings(text) {
  // Handle code blocks with language detection and copy button
  let codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let codeBlockIndex = 0;
  let replaced = text.replace(codeBlockRegex, (match, language, code) => {
    const lang = language || "text";
    const isPython = lang.toLowerCase() === "python";
    const codeId = `code-${Date.now()}-${codeBlockIndex++}`;

    return `
      <div class="code-block-container" style="margin: 1em 0; border-radius: 8px; overflow: hidden; border: 1px solid #e1e5e9;">
        <div class="code-header" style="background: ${
          isPython ? "#3776ab" : "#f8f9fa"
        }; color: ${
      isPython ? "white" : "#495057"
    }; padding: 8px 12px; font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
          <span>${isPython ? "🐍 Python" : lang.toUpperCase()}</span>
          <button onclick="copyCode('${codeId}')" style="background: ${
      isPython ? "rgba(255,255,255,0.2)" : "#007bff"
    }; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: opacity 0.2s;">Copy</button>
        </div>
        <pre id="${codeId}" style="background: ${
      isPython ? "#f8f9fa" : "#f8f9fa"
    }; margin: 0; padding: 16px; overflow-x: auto; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 13px; line-height: 1.4; color: #333;"><code>${code.trim()}</code></pre>
      </div>
    `;
  });

  // Process the rest of the text line by line
  let lines = replaced.replace(/\r\n/g, "\n").split("\n");
  let formatted = [];

  lines.forEach((line) => {
    let trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      formatted.push("<br/>");
      return;
    }

    // Handle inline code
    trimmed = trimmed.replace(
      /`([^`]+)`/g,
      '<code style="background:#f0f4f9; padding:2px 6px; border-radius:4px; font-family: monospace; font-size: 0.9em; color: #d63384;">$1</code>'
    );

    // Handle bold text (**text**)
    trimmed = trimmed.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong style="font-weight: 600; color: #2c3e50;">$1</strong>'
    );

    // Handle italic text (*text*)
    trimmed = trimmed.replace(
      /\*([^*]+)\*/g,
      '<em style="font-style: italic; color: #6c757d;">$1</em>'
    );

    // Handle markdown headings (##, ###, etc.)
    if (/^#{1,6}\s+/.test(trimmed)) {
      const level = trimmed.match(/^(#{1,6})\s+/)[1].length;
      const headingText = trimmed.replace(/^#{1,6}\s+/, "");
      const fontSize = Math.max(1.8 - (level - 2) * 0.2, 1.2);

      formatted.push(
        `<h${level} style="display:block; margin:1.5em 0 0.8em 0; font-size:${fontSize}em; font-weight:700; color:#2c3e50; border-bottom: 2px solid #e9ecef; padding-bottom: 0.3em;">${headingText}</h${level}>`
      );
    } else {
      // Regular paragraph
      formatted.push(
        `<p style="margin: 0.8em 0; line-height: 1.6; color: #333;">${trimmed}</p>`
      );
    }
  });

  return formatted.join("");
}

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [image, setImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = import.meta.env.PROD 
    ? "https://astra-chatbot-backend.vercel.app/api" 
    : "http://localhost:5001/api";

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      loadChatHistory();
    }
  }, []);

  // Load chat history from backend
  const loadChatHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/chat/recent?limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.data.chats);
        // Update prevPrompts for sidebar display
        setPrevPrompts(data.data.chats.map((chat) => chat.prompt));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setChatHistory([]);
    setPrevPrompts([]);
  }, []);

  // Delete chat from backend
  const deleteChatFromBackend = useCallback(
    async (chatId) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Update local state instead of reloading
          setChatHistory((prev) => prev.filter((chat) => chat._id !== chatId));
          setPrevPrompts((prev) =>
            prev.filter(
              (_, index) =>
                chatHistory.findIndex((chat) => chat._id === chatId) !== index
            )
          );
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    },
    [chatHistory]
  );

  // Save chat to backend
  const saveChatToBackend = useCallback(async (prompt, response) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const apiResponse = await fetch(`${API_BASE_URL}/chat/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, response }),
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        // Add the new chat to local state instead of reloading
        const newChat = {
          _id: data.data.id,
          prompt: prompt,
          response: response,
          timestamp: new Date().toISOString(),
          isFavorite: false,
        };

        setChatHistory((prev) => [newChat, ...prev.slice(0, 19)]); // Keep only 20 most recent
        setPrevPrompts((prev) => [prompt, ...prev.slice(0, 19)]); // Keep only 20 most recent
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  }, []);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setImage(null);
    setResultData("");
    setRecentPrompt("");
  };

  // Load an existing chat conversation from history
  const loadExistingChat = (chat) => {
    setRecentPrompt(chat.prompt);
    // Format the response using the same formatting function as new chats
    const formattedResponse = formatHeadings(chat.response);
    setResultData(formattedResponse);
    setShowResult(true);
    setLoading(false);
    setImage(null);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    const headingInstruction = `IMPORTANT: Format your answer using markdown. Use '##' for each main section heading, and use bullet points for lists. Always start your answer with a heading. Example:\n\n## Main Topic\n- Point 1\n- Point 2\n\n## Another Section\n- Detail 1\n- Detail 2\n\nNow answer the following:\n`;
    let response;
    if (prompt !== undefined) {
      response = await run(headingInstruction + prompt, image);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(headingInstruction + input, image);
    }

    // Format headings and code
    const formatted = formatHeadings(response);
    // If the response contains a code block or pre, set it directly (no animation)
    if (formatted.includes("<pre") || formatted.includes("<code")) {
      setResultData(formatted);
    } else {
      // Animate the response word by word
      let newResponseArray = formatted.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    }
    setLoading(false);
    setInput("");
    setImage(null);

    // Save chat to backend if user is authenticated
    if (isAuthenticated) {
      saveChatToBackend(prompt || input, response);
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    loadExistingChat,
    setImage,
    chatHistory,
    loadChatHistory,
    isAuthenticated,
    setIsAuthenticated,
    logout,
    deleteChatFromBackend,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
