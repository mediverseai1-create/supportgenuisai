import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { agentId, message, history = [], testMode = false } = await req.json()

    if (!agentId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get knowledge items for context
    const { data: knowledgeItems } = await supabase
      .from('knowledge_items')
      .select('question, answer, content, category')
      .eq('agent_id', agentId)
      .limit(20)

    // Build context from knowledge
    const knowledgeContext = knowledgeItems && knowledgeItems.length > 0
      ? knowledgeItems.map(item => {
          if (item.question && item.answer) {
            return `Q: ${item.question}\nA: ${item.answer}`
          }
          return item.content
        }).join('\n\n')
      : 'No specific knowledge base has been added yet.'

    // Build system prompt
    const systemPrompt = `${agent.persona || 'You are a helpful, professional customer support agent. Be friendly, concise, and accurate.'}

BUSINESS KNOWLEDGE BASE:
${knowledgeContext}

IMPORTANT INSTRUCTIONS:
- Only answer based on the knowledge base above when it applies
- If a question is not covered by the knowledge base but is a reasonable general question, answer helpfully
- Never make up specific business details, prices, policies, or information not in your knowledge base
- If you don't know something specific to the business, honestly say so and offer to connect them with a human agent
- Be conversational and natural
- Keep responses concise but complete
- If the customer is frustrated, acknowledge their feelings
- Watch for escalation triggers: explicit requests for a human, repeated failures, legal threats, billing disputes

${agent.escalation_rules ? `ESCALATION RULES:\n${typeof agent.escalation_rules === 'string' ? agent.escalation_rules : JSON.stringify(agent.escalation_rules)}` : ''}

Respond only with the support message. Do not add any meta-commentary.`

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    // Build chat history
    const chatHistory = history.map((msg: any) => ({
      role: msg.role === 'customer' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({ history: chatHistory })
    const result = await chat.sendMessage(message)
    const response = result.response.text()

    // Estimate confidence based on knowledge overlap
    const hasRelevantKnowledge = knowledgeItems && knowledgeItems.length > 0
    const confidence = hasRelevantKnowledge ? 0.85 : 0.6

    // Check for escalation signals
    const escalationKeywords = ['human', 'manager', 'supervisor', 'agent', 'person', 'lawsuit', 'legal', 'unacceptable']
    const shouldEscalate = escalationKeywords.some(kw => message.toLowerCase().includes(kw))

    return NextResponse.json({
      response,
      confidence,
      shouldEscalate,
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'AI service error', response: 'I apologize, I\'m experiencing technical difficulties. Please try again or contact support directly.' },
      { status: 500 }
    )
  }
}
