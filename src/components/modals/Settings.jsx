import React, { useRef, useEffect } from "react";

const Settings = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  // Use local state for unsaved changes
  const [darkMode, setDarkMode] = React.useState(false);
  const [fontSize, setFontSize] = React.useState("medium");
  // Track the saved settings
  const [savedDarkMode, setSavedDarkMode] = React.useState(false);
  const [savedFontSize, setSavedFontSize] = React.useState("medium");
  // Animation state for smooth transition
  const [show, setShow] = React.useState(false);

  // Restore settings from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const savedDark = localStorage.getItem("astra_dark_mode");
      const savedFont = localStorage.getItem("astra_font_size");
      setDarkMode(savedDark === "true");
      setFontSize(savedFont || "medium");
      setSavedDarkMode(savedDark === "true");
      setSavedFontSize(savedFont || "medium");
      setShow(true);
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Only apply dark mode/font size to body when saved
  useEffect(() => {
    document.body.style.transition = "background 0.3s, color 0.3s";
    if (savedDarkMode) {
      document.body.classList.add("astra-dark-mode");
    } else {
      document.body.classList.remove("astra-dark-mode");
    }
    document.body.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large"
    );
    document.body.classList.add(`font-size-${savedFontSize}`);
  }, [savedDarkMode, savedFontSize]);

  // Close modal when clicking outside
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

  if (!isOpen && !show) return null;

  const handleSave = () => {
    localStorage.setItem("astra_dark_mode", darkMode);
    localStorage.setItem("astra_font_size", fontSize);
    setSavedDarkMode(darkMode);
    setSavedFontSize(fontSize);
    onClose();
  };

  // Detect dark mode for modal styling (use unsaved value)
  const isDark = darkMode;
  const modalBg = isDark ? "#232336" : "#fff";
  const textColor = isDark ? "#f3f3fa" : "#2d2250";
  const subTextColor = isDark ? "#bdbdd7" : "#6d4eae";
  const labelColor = isDark ? "#e0e0ff" : "#2d2250";
  const selectBg = isDark ? "#232336" : "#fff";
  const selectBorder = isDark ? "#44445a" : "#ccc";
  const selectText = isDark ? "#f3f3fa" : "#2d2250";
  const closeBtnColor = isDark ? "#bdbdd7" : "#888";
  const closeBtnHover = isDark ? "#fff" : "#444";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-xl p-8 rounded-lg shadow flex flex-col items-center mx-4 relative transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ background: modalBg, color: textColor }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl font-bold focus:outline-none"
          style={{ color: closeBtnColor }}
          onMouseOver={(e) => (e.currentTarget.style.color = closeBtnHover)}
          onMouseOut={(e) => (e.currentTarget.style.color = closeBtnColor)}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h1
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: textColor }}
        >
          Settings
        </h1>
        <p className="mb-6 text-center" style={{ color: subTextColor }}>
          Manage your preferences and personalize your Astra experience.
        </p>
        <div className="w-full flex flex-col gap-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-lg" style={{ color: labelColor }}>
              Dark Mode
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode((v) => !v)}
              />
              <div
                className={`w-11 h-6 ${
                  isDark ? "bg-purple-900" : "bg-gray-200"
                } peer-focus:outline-none rounded-full peer peer-checked:bg-purple-500 transition-all flex items-center relative`}
              >
                <div
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    darkMode ? "translate-x-5" : ""
                  }`}
                  style={{ transition: "transform 0.2s" }}
                ></div>
              </div>
              <span
                className="ml-3 text-sm font-medium"
                style={{ color: subTextColor }}
              >
                {darkMode ? "On" : "Off"}
              </span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-lg" style={{ color: labelColor }}>
              Font Size
            </span>
            <select
              className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{
                background: selectBg,
                borderColor: selectBorder,
                color: selectText,
              }}
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        <button
          className="bg-purple-600 text-white px-8 py-2 rounded font-medium hover:bg-purple-700 transition w-full mt-2"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
