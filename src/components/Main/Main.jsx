import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import VoiceInput from "../VoiceInput";
import ImageUpload from "../ImageUpload";

const Main = () => {
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

  const user = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  return (
    <div className="main">
      <div className="nav">
        <p>Astra</p>
        <div className="nav-user">
          {isAuthenticated && user ? (
            <>
              <span className="user-name">Hello, {user.name}!</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
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
                <span>Hello, {isAuthenticated && user ? user.name : 'Genius'}!</span>
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
