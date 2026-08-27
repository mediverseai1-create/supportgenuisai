import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { conversationId } = await req.json()
    if (!conversationId) return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })

    const supabase = await createClient()

    const { data: messages } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at')

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages found' }, { status: 404 })
    }

    const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Analyze this customer support conversation and provide a structured analysis.

CONVERSATION:
${transcript}

Provide your analysis as JSON with these exact fields:
{
  "summary": "2-3 sentence summary of what happened",
  "intent": "primary customer intent in 3-5 words",
  "sentiment": "positive" | "neutral" | "negative",
  "resolution": "how the issue was resolved, or null if unresolved",
  "issues": ["list of issues raised"],
  "unresolved": ["list of unresolved items if any"]
}

Respond with only valid JSON.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Update conversation record
    await supabase.from('conversations').update({
      summary: analysis.summary,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      resolution: analysis.resolution,
      updated_at: new Date().toISOString(),
    }).eq('id', conversationId)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
