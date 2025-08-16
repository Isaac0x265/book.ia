import { useState } from 'react'
import type { Chapter, Progress, Mode } from '../types'
import { generateSubtopics, generateChapterContent } from '../utils/openAIService'

export const useContentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 0 })
  const [chapters, setChapters] = useState<Chapter[]>([])

  const generateContent = async (
    topic: string,
    apiKey: string,
    selectedModel: string,
    mode: Mode
  ) => {
    if (!topic.trim() || !apiKey.trim()) {
      alert('Please enter both topic and API key')
      return
    }

    setIsGenerating(true)
    setProgress({ current: 0, total: 3 })
    setChapters([])

    try {
    // here it could have been ideal to keep the function logic in a separate file however im trying to
    // keep a balance between complexity and readability

      setProgress({ current: 1, total: 3 })
      const subtopics = await generateSubtopics(topic, apiKey, selectedModel)
      
      
      setProgress({ current: 2, total: 3 })
      
      const chapters = []
      for (let i = 0; i < subtopics.length; i++) {
        const content = await generateChapterContent(subtopics[i], i, topic, mode, apiKey, selectedModel)
        // Simple mode-based title formatting: ebook gets "Chapter X:" prefix, others don't
        const title = mode === 'ebook' ? `Chapter ${i + 1}: ${subtopics[i]}` : subtopics[i]
        chapters.push({ title, content })
      }
      
      setChapters(chapters)
      setProgress({ current: 3, total: 3 })

      return chapters
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Error generating content. Please check your API key and try again.')
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const resetGeneration = () => {
    setChapters([])
    setProgress({ current: 0, total: 0 })
    setIsGenerating(false)
  }

  return {
    isGenerating,
    progress,
    chapters,
    generateContent,
    resetGeneration
  }
}