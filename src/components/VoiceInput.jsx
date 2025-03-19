import React, { useState } from "react";
import { assets } from "../assets/assets";

const VoiceInput = ({ setInput }) => {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US"; 
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <img 
      src={
        assets.mic_icon
      }
      alt="Mic" 
      onClick={startListening} 
      style={{ cursor: "pointer" }} 
    />
  );
};

export default VoiceInput;
