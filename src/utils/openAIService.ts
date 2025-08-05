import { Mode } from '../types'

export const generateSubtopics = async (mainTopic: string, apiKey: string, selectedModel: string): Promise<string[]> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [{
        role: 'user',
        content: `Break down the topic "${mainTopic}" into exactly 10 subtopics. Return only the subtopics as a numbered list, one per line.`
      }],
      max_tokens: 500,
      temperature: 0.7
    })
  })

  const data = await response.json()
  const content = data.choices[0].message.content
  
  return content
    .split('\n')
    .filter((line: string) => line.trim())
    .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 10)
}

export const generateChapterContent = async (
  subtopic: string, 
  index: number, 
  topic: string, 
  mode: Mode, 
  apiKey: string, 
  selectedModel: string
): Promise<string> => {
  const isEbook = mode === 'ebook'
  const prompt = isEbook 
    ? `You are an expert writer creating professional ebook content. Write Chapter ${index + 1}: ${subtopic} for an ebook about "${topic}". 

REQUIREMENTS:
- Write at least 1500 words minimum (aim for 1800-2000 words)
- Use engaging subheaders with relevant emojis
- Include practical examples and detailed explanations
- Add relevant emojis throughout the content to make it engaging
- Use proper markdown formatting with headers, subheaders, bold text, and formatting
- Start with a compelling introduction and end with a strong conclusion
- Avoid oversimplification - provide deep, comprehensive content
- Do not mention this is a chapter or part of a book in the content
- Write in an authoritative, expert tone with specific details and insights

Make this content comprehensive, detailed, and valuable for readers seeking expert knowledge.`
    : `You are an expert writer. Write a detailed, comprehensive explanation about "${subtopic}" of at least 1500 words minimum (aim for 1800-2000 words). Use proper markdown formatting with headers, subheaders, and formatting. Focus on providing in-depth knowledge and insights. Do not use bullet points or mention chapters. Write as a standalone educational piece. Avoid oversimplification and provide comprehensive, detailed content with specific examples and expert insights.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 2500,
      temperature: 0.7
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}