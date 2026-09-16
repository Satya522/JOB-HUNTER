import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// API Key setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // PDF ko Base64 mein convert karna taaki Gemini padh sake
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')

    // Gemini 1.5 Flash - Super fast for document parsing
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Strict Prompt for exact JSON structure
    const prompt = `
      You are an expert ATS (Applicant Tracking System) and a Senior Tech Recruiter.
      Analyze the provided resume document.
      Evaluate it based on industry standards for software engineering roles.
      
      Return EXACTLY AND ONLY a valid JSON object with this exact structure (do not add \`\`\`json or any markdown):
      {
        "score": <number between 0-100 based on formatting, keywords, and impact>,
        "status": "<string: Excellent, Good, or Needs Work>",
        "matched": ["<array of 5-8 key hard skills/technologies ACTUALLY present in the resume>"],
        "missing": ["<array of 3-5 important industry skills/buzzwords missing based on their role>"],
        "tips": ["<array of exactly 3 strictly actionable, highly specific improvement tips>"]
      }
    `

    // Call Gemini API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'application/pdf',
        },
      },
    ])

    const responseText = result.response.text()
    
    // Clean response just in case Gemini adds markdown backticks
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    const jsonResult = JSON.parse(cleanedText)

    return NextResponse.json({ success: true, data: jsonResult })

  } catch (error: any) {
    console.error('ATS Analysis Error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Analysis failed' }, { status: 500 })
  }
}