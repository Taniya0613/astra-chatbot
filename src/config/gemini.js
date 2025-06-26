import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // ✅ Use import.meta.env for Vite
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

async function run(prompt, image) {
  // Defensive: always use string
  const promptText = typeof prompt === "string" ? prompt : String(prompt);

  let parts;
  if (image) {
    const imagePart = await fileToGenerativePart(image);
    parts = [{ text: promptText }, imagePart];
  } else {
    parts = [{ text: promptText }];
  }

  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: parts
    }],
    generationConfig,
  });

  return result.response.text();
}

export default run;
