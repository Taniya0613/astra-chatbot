// Main chat interface component. Handles chat display, user input, and profile popup.
import React, { useContext, useRef, useState, useEffect } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import VoiceInput from "../common/VoiceInput";
import ImageUpload from "../common/ImageUpload";

const Main = () => {
  // Destructure context values for chat and authentication
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    setImage,
    isAuthenticated,
    logout,
  } = useContext(Context);

  // Get user info from localStorage if authenticated
  const user = isAuthenticated
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileRef = useRef(null);
  const popupRef = useRef(null);

  // Hide profile popup when clicking outside of it
  useEffect(() => {
    if (!showProfilePopup) return;
    const handleClick = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfilePopup]);

  // Use user.avatar if available, else fallback to user_icon
  const profilePhoto = user && user.avatar ? user.avatar : assets.user_icon;

  return (
    <div className="main">
      <div className="nav">
        <p
          className="astra-logo"
          style={{ fontSize: 40, fontWeight: 700, letterSpacing: 0.5 }}
        >
          Astra
        </p>
        <div className="nav-user" style={{ position: "relative" }}>
          {isAuthenticated && user ? (
            <>
              <img
                ref={profileRef}
                src={profilePhoto}
                alt="Profile"
                className="profile-photo"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
                onClick={() => setShowProfilePopup((prev) => !prev)}
              />
              {showProfilePopup && (
                <div
                  ref={popupRef}
                  className="profile-popup"
                  style={{
                    position: "absolute",
                    top: 56,
                    right: 0,
                    background: "#fff",
                    color: "#2d2250",
                    borderRadius: 12,
                    boxShadow: "0 4px 24px rgba(80,60,120,0.13)",
                    // padding: "18px 24px",
                    padding: "22px 11px",
                    minWidth: 220,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: 12,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: 13, color: "#6d4eae" }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    style={{
                      background: "#6d4eae",
                      color: "#fff",
                      border: "none",
                      borderRadius: 80,
                      padding: "6px 0",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      width: "100%",
                      marginTop: 4,
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <img src={assets.user_icon} alt="" />
          )}
        </div>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>
                  Hello, {isAuthenticated && user ? user.name : "Genius"}!
                </span>
              </p>
              <p>What's on your mind today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Recommend stunning destinations for my next road trip.</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Summarize the key ideas behind urban planning.</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Suggest creative team bonding activities for our retreat.</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Enhance the readability of this code snippet.</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <ImageUpload onImageSelect={setImage} />
              <VoiceInput setInput={setInput} />
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Astra may display inaccurate info, including about people, so
            double-check its responses.Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
