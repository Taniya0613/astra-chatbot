import React from "react";
import { assets } from "../assets/assets";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speechrecognition";

const VoiceInput = ({ setInput }) => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Clear previous transcript
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
    }
  };

  React.useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  return (
    <img
      src={
        listening ? assets.mic_icon_active : assets.mic_icon // Assuming you have an active mic icon
      }
      alt="Mic"
      onClick={handleMicClick}
      style={{ cursor: "pointer" }}
    />
  );
};

export default VoiceInput;
