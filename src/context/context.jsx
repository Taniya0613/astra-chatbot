import { createContext, use, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

function formatHeadings(text) {
  // Handle code blocks (``` ... ```)
  let codeBlockRegex = /```([\s\S]*?)```/g;
  let codeBlocks = [];
  let replaced = text.replace(codeBlockRegex, (match, p1, offset) => {
    codeBlocks.push(p1);
    return `[[CODEBLOCK_${codeBlocks.length - 1}]]`;
  });

  // Now process line by line
  let lines = replaced.replace(/\r\n/g, "\n").split("\n");
  let formatted = [];
  let foundHeading = false;

  lines.forEach((line) => {
    let trimmed = line.trim();

    // Restore code blocks
    if (trimmed.startsWith("[[CODEBLOCK_")) {
      let idx = parseInt(trimmed.match(/\d+/)[0]);
      formatted.push(
        `<pre style="background:#f0f4f9;padding:1em;border-radius:8px;overflow:auto;"><code>${codeBlocks[idx]}</code></pre>`
      );
      return;
    }

    // Inline code
    trimmed = trimmed.replace(
      /`([^`]+)`/g,
      '<code style="background:#f0f4f9;padding:2px 4px;border-radius:4px;">$1</code>'
    );

    // Markdown headings (##, ###, etc.)
    if (/^#{1,6}\s+/.test(trimmed)) {
      foundHeading = true;
      formatted.push(
        `<span style="display:block;margin:1.2em 0 0.5em 0;font-size:1.2em;font-weight:bold;color:#a12626;">${trimmed.replace(
          /^#{1,6}\s+/,
          ""
        )}</span>`
      );
    } else if (/^\d+\.\s+.+:/.test(trimmed)) {
      foundHeading = true;
      formatted.push(
        `<span style="display:block;margin:1.2em 0 0.5em 0;font-size:1.1em;font-weight:bold;color:#a12626;">${trimmed}</span>`
      );
    } else if (/^[A-Z][A-Za-z0-9 .-]*:$/.test(trimmed)) {
      foundHeading = true;
      formatted.push(
        `<span style="display:block;margin:1.2em 0 0.5em 0;font-size:1.1em;font-weight:bold;color:#a12626;">${trimmed}</span>`
      );
    } else if (/^\*\*(.+)\*\*$/.test(trimmed)) {
      foundHeading = true;
      formatted.push(
        `<span style="display:block;margin:1.2em 0 0.5em 0;font-size:1.1em;font-weight:bold;color:#a12626;">${trimmed.replace(
          /\*\*/g,
          ""
        )}</span>`
      );
    } else {
      formatted.push(trimmed);
    }
  });

  // Fallback: bold key phrases if no headings found
  if (!foundHeading) {
    return text.replace(
      /(stands for|definition|purpose|meaning|example|explanation|in summary|in short|note:)/gi,
      '<b style="color:#a12626;">$1</b>'
    );
  }

  return formatted.join("<br/>");
}

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [image, setImage] = useState(null);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
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
    setImage,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
