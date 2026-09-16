import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userAnswer, history, difficulty, jobRole } = await req.json();

    console.log(`🎙️ Routing Request... Difficulty: ${difficulty}`);

    // HARD MODE -> DEEPSEEK
    if (difficulty === "hard") {
      console.log("Routing to DeepSeek...");
      return await getDeepSeekResponse(userAnswer, history, jobRole);
    } 
    // STANDARD/EASY MODE -> GEMINI (Replaced Groq)
    else {
      console.log("Routing to Gemini...");
      return await getGeminiResponse(userAnswer, history, jobRole);
    }

  } catch (error) {
    console.error("🔥 MAIN ROUTE CRASH:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// Helper Functions (Clean & Stable & Interactive)
// ---------------------------------------------------------

async function getDeepSeekResponse(answer: string, history: any[], role: string) {
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: `You are a strict technical interviewer for ${role}. The user might speak in Hindi/Hinglish. Understand it, but reply only in professional English. IF the user asks for a hint or gets stuck, provide a brief, professional hint before asking your next hard technical question.` 
          }, 
          ...history, 
          { role: "user", content: answer }
        ]
      })
    });
    
    if (!res.ok) {
      const err = await res.text();
      console.error("🚨 DEEPSEEK REJECTED:", err);
      return NextResponse.json({ nextQuestion: "DeepSeek API error. Check terminal.", aiUsed: "Error" });
    }
    
    const data = await res.json();
    return NextResponse.json({ nextQuestion: data.choices[0].message.content, aiUsed: "DeepSeek" });
  } catch (error) {
    console.error("DeepSeek Fetch Error:", error);
    return NextResponse.json({ nextQuestion: "DeepSeek Network Error.", aiUsed: "Error" });
  }
}

async function getGeminiResponse(answer: string, history: any[], role: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Gemini needs history formatted as a string for context
    const formattedHistory = history.map(h => `${h.role}: ${h.content}`).join('\n');
    
    const prompt = `You are a friendly but professional HR/Tech Interviewer for the ${role} position.
    
    Previous Conversation:
    ${formattedHistory}
    
    User's latest input: "${answer}"
    
    INSTRUCTIONS:
    1. The user might speak in Hindi or Hinglish. You MUST understand it.
    2. YOU must reply ONLY in crisp, professional English.
    3. IF THE USER ASKS A QUESTION (e.g., asking for a hint, getting stuck, or asking for clarification), politely answer their question or provide a hint FIRST, then ask your next interview question.
    4. IF THE USER ANSWERS YOUR QUESTION, evaluate it internally, and ask the next logical medium-level technical question.
    5. Keep your response conversational and short (Max 2-3 sentences).`;
    
    const result = await model.generateContent(prompt);
    return NextResponse.json({ nextQuestion: result.response.text(), aiUsed: "Gemini" });
  } catch (error) {
    console.error("🚨 GEMINI REJECTED:", error);
    return NextResponse.json({ nextQuestion: "Gemini API error. Check terminal.", aiUsed: "Error" });
  }
}