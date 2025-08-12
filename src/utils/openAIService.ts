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
  
  // Simple parsing - split by lines and clean up
  const lines = content.split('\n').filter((line: string) => line.trim())
  const subtopics = []
  
  for (const line of lines) {
    // Remove number and clean up
    const cleaned = line.replace(/^\d+\.?\s*/, '').trim()
    if (cleaned && subtopics.length < 10) {
      subtopics.push(cleaned)
    }
  }
  
  return subtopics
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
  let prompt = ''
  
  if (isEbook) {
    prompt = `Write Chapter ${index + 1}: ${subtopic} for an ebook about "${topic}". Write at least 1500 words with proper markdown formatting, subheaders, and examples. Make it comprehensive and detailed.`
  } else {
    prompt = `Write a detailed explanation about "${subtopic}". Write at least 1500 words with proper markdown formatting and examples. Make it comprehensive and educational.`
  }

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