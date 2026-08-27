import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { sourceId } = await req.json()
    if (!sourceId) return NextResponse.json({ error: 'Missing sourceId' }, { status: 400 })

    const supabase = await createClient()

    const { data: source, error } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('id', sourceId)
      .single()

    if (error || !source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    // Mark as processing
    await supabase.from('knowledge_sources').update({ status: 'processing' }).eq('id', sourceId)

    let contentToProcess = ''

    if (source.type === 'url' && source.url) {
      // Fetch URL content
      try {
        const response = await fetch(source.url, {
          headers: { 'User-Agent': 'SupportGeniusBot/1.0' },
          signal: AbortSignal.timeout(10000),
        })
        const html = await response.text()
        // Strip HTML tags
        contentToProcess = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 10000)
      } catch {
        contentToProcess = `Website: ${source.url}\nContent could not be fetched automatically. Please add content manually.`
      }
    } else if (source.content) {
      contentToProcess = source.content
    }

    if (!contentToProcess) {
      await supabase.from('knowledge_sources').update({
        status: 'error',
        error_message: 'No content to process',
      }).eq('id', sourceId)
      return NextResponse.json({ error: 'No content' }, { status: 400 })
    }

    // Use Gemini to extract structured knowledge items
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Extract customer support knowledge from this content. Create question-answer pairs that a support AI would use.

CONTENT:
${contentToProcess}

Extract up to 15 key knowledge items. Format as JSON array:
[
  {
    "question": "What is the return policy?",
    "answer": "You can return items within 30 days...",
    "category": "Returns"
  }
]

Focus on: policies, procedures, FAQs, product info, contact details, pricing, hours.
Respond with only the JSON array.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Could not parse AI response')

    const items = JSON.parse(jsonMatch[0])

    // Insert knowledge items
    if (items.length > 0) {
      await supabase.from('knowledge_items').insert(
        items.map((item: any) => ({
          source_id: sourceId,
          agent_id: source.agent_id,
          organization_id: source.organization_id,
          question: item.question || null,
          answer: item.answer || null,
          content: item.question && item.answer ? `Q: ${item.question}\nA: ${item.answer}` : (item.content || ''),
          category: item.category || null,
        }))
      )
    }

    // Mark source as indexed
    await supabase.from('knowledge_sources').update({
      status: 'indexed',
      item_count: items.length,
      error_message: null,
    }).eq('id', sourceId)

    return NextResponse.json({ success: true, itemCount: items.length })
  } catch (error) {
    console.error('Knowledge processing error:', error)

    const supabase = await createClient()
    const { sourceId } = await (req.clone()).json().catch(() => ({ sourceId: null }))

    if (sourceId) {
      await supabase.from('knowledge_sources').update({
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Processing failed',
      }).eq('id', sourceId)
    }

    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
