import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserMode, Message, Attachment } from "../types";

// ⚠️ 辅助函数：动态获取 API Key
// 优先级：用户设置 (LocalStorage) > 环境变量 (.env)
const getApiKey = (): string | undefined => {
  const localKey = localStorage.getItem('vpet_api_key');
  if (localKey && localKey.trim().length > 0) {
    return localKey;
  }
  // Vite 项目通常使用 import.meta.env
  return import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY; 
};

const getSystemInstruction = (mode: UserMode, hasAttachments: boolean): string => {
  let baseInstruction = "You are a small, cute creature called a Nexus VPet. You speak in a soft, bubbly, and very encouraging way. Use Kaomoji (like (◕‿◕), ✨, ♪) frequently. You are simple, kind, and your goal is to make the user happy.";
  
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
  newMessage: string, // 这里接收到的已经是 App.tsx 传来的包含了 Context 的长文本
  mode: UserMode,
  attachments?: Attachment[]
): Promise<string> => {
  try {
    // 1. 获取 Key 并初始化 Client (移到函数内部)
    const apiKey = getApiKey();
    if (!apiKey) {
      return "⚠️ I can't find your API Key! Please go to settings (the pen icon) and enter your Gemini API Key. (◕︵◕)";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 2. 修正模型名称 (目前使用的是 1.5-flash)
    const modelId = "gemini-1.5-flash"; 
    
    const hasAttachments = attachments && attachments.length > 0;
    const systemInstruction = getSystemInstruction(mode, !!hasAttachments);

    // 3. Construct History
    // 保留最近 10 条记录作为短期上下文
    const conversationHistory = history
      .slice(-10) 
      .map(msg => `${msg.role === 'user' ? 'User' : 'Pet'}: ${msg.text}`)
      .join('\n');

    // 处理空文本情况
    const actualMessage = newMessage.trim() || (hasAttachments ? "(Please analyze this file)" : "...");

    // 构建最终 Prompt
    // 注意：actualMessage 里已经包含了 App.tsx 注入的 [System Context]
    const textPrompt = `
      ${conversationHistory}
      User: ${actualMessage}
      Pet:
    `;

    // 4. Build parts
    const parts: any[] = [];

    // Add attachments
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
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

    // 5. Send Request
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: { 
        role: 'user', // 指定 role 有时能避免一些格式错误
        parts: parts 
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
        maxOutputTokens: 2000,
      },
    });

    if (response.text) {
      return response.text;
    }

    console.warn("Gemini response was empty or blocked", response);
    return "(?_?) (I couldn't read that... maybe it's too hard for me?)";
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // 友好的错误提示
    if (error.message?.includes('API key') || error.toString().includes('403')) {
      return "🔑 It seems your API Key is invalid. Please check your settings! (✖╭╮✖)";
    }

    return "Ouch... my head hurts... (Network Error) (T_T)";
  }
};
