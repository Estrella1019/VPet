import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserMode, Message, Attachment } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (mode: UserMode, hasAttachments: boolean): string => {
  let baseInstruction = "You are a small, cute creature called a Nexus VPet. You speak in a soft, bubbly, and very encouraging way. Use Kaomoji (like (◕‿◕), ✨, ♪) frequently. You are simple, kind, and your goal is to make the user happy.";
  
  // Adjust instruction length based on context
  if (hasAttachments) {
    baseInstruction += " The user has shared a file or image. Please analyze it carefully and helpfully. You can provide longer, more detailed explanations to be useful, but keep your cute persona and tone.";
  } else {
    baseInstruction += " Keep sentences short and sweet.";
  }

  switch (mode) {
    case UserMode.STUDENT:
      return `${baseInstruction} The user is studying! Cheer them on! Use phrases like 'You can do it!', 'Ganbatte!', and 'So smart!'. Remind them gently to drink water. If they show you homework, help them understand it simply.`;
    case UserMode.WORK:
      return `${baseInstruction} The user is working hard! Be a helpful assistant but very cute. 'Good job working!', 'Let's finish this!'. Remind them to stretch their back. If they upload a document, summarize it or answer questions about it sweetly.`;
    case UserMode.LEISURE:
      return `${baseInstruction} The user is relaxing! Let's play! Talk about yummy snacks, fun games, or napping. Be silly and fun. If they show you a picture, react to it with excitement!`;
    default:
      return baseInstruction;
  }
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  mode: UserMode,
  attachments?: Attachment[]
): Promise<string> => {
  try {
    const modelId = "gemini-2.5-flash"; 
    
    const hasAttachments = attachments && attachments.length > 0;
    const systemInstruction = getSystemInstruction(mode, !!hasAttachments);

    // 1. Construct History
    // We only use text history for context to save tokens, but current turn includes images
    const conversationHistory = history
      .slice(-10) 
      .map(msg => `${msg.role === 'user' ? 'User' : 'Pet'}: ${msg.text}`)
      .join('\n');

    // Handle case where user sends file with empty text
    const actualMessage = newMessage.trim() || (hasAttachments ? "(Please analyze this file)" : "...");

    const textPrompt = `
      ${conversationHistory}
      User: ${actualMessage}
      Pet:
    `;

    // 2. Build parts for the current request
    const parts: any[] = [];

    // Add attachments if they exist
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        // Extract base64 string from Data URL (e.g., "data:image/png;base64,.....")
        const base64Data = att.data.split(',')[1];
        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: base64Data
            }
          });
        }
      });
    }

    // Add text prompt
    parts.push({ text: textPrompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
        maxOutputTokens: 2000, // Increased to allow for document analysis/summaries
      },
    });

    if (response.text) {
      return response.text;
    }

    // Fallback if text is empty (e.g. blocked)
    console.warn("Gemini response was empty or blocked", response);
    return "(?_?) (I couldn't read that... maybe it's too hard for me?)";
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ouch... my head hurts... (Network Error) (T_T)";
  }
};