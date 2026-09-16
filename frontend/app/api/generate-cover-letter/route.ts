import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return new Response("Missing required parameters", { status: 400 });
    }

    const prompt = `
      You are a highly skilled, collaborative Senior Software Engineer writing a cover letter to an Engineering Manager/CTO. 

      STRICT RULES FOR A TECHNICAL, MANAGER-READY TONE:
      1. THE WARM HOOK: Start directly by acknowledging their specific technical challenge from the Job Description (e.g., dashboard latency, scaling issues). No "I am writing to apply...".
      2. THE TECHNICAL 'HOW' (CRUCIAL): Do not just say you will fix the problem. Explain EXACTLY HOW you will fix it using the tech stack from the Resume. Mention specific techniques (e.g., "offloading chart calculations to Web Workers", "implementing Redis caching", "using React.memo to prevent re-renders", "optimizing indexing in PostgreSQL"). Act like an architect proposing a solution.
      3. METRICS AS PROOF: Back up your proposed solution by tying it to a metric from the Resume (e.g., "Using this approach previously, I reduced API response times by 60%...").
      4. COLLABORATIVE TONE: Write like a reliable future teammate discussing a problem over coffee. Confident, direct, but humble.
      5. BAN AI CLICHÉS: NO words like "thrilled", "passionate", "delve", "testament", "cutting-edge", "seamless", "spearheaded", or "dynamic landscape". Keep it plain, sharp engineering English.
      6. FORMAT: Exactly 3 concise paragraphs. Maximum 200 words. 

      DATA:
      - Resume/Skills: ${resumeText}
      - Job Description: ${jobDescription}

      Output ONLY the letter body. No placeholders like [Date], [Name], or [Address].
    `;

    // Asli Jadoo Yahan Hai: stream: true
    const completionStream = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true, 
    });

    // Next.js mein stream bhejne ka tareeka
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completionStream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("Groq Streaming Error:", error);
    return new Response("Failed to generate document", { status: 500 });
  }
}