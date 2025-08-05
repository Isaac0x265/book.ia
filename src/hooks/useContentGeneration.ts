import { useState } from 'react'
import { Chapter, Progress, Mode } from '../types'
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
      // Generate subtopics
      setProgress({ current: 1, total: 3 })
      const subtopics = await generateSubtopics(topic, apiKey, selectedModel)
      
      // Generate all chapters in parallel for much faster processing
      setProgress({ current: 2, total: 3 })
      
      const chapterPromises = subtopics.map((subtopic, i) => 
        generateChapterContent(subtopic, i, topic, mode, apiKey, selectedModel).then(content => ({
          title: mode === 'ebook' ? `Chapter ${i + 1}: ${subtopic}` : subtopic,
          content,
          index: i
        }))
      )
      
      // Wait for all chapters to complete simultaneously
      const chapterResults = await Promise.all(chapterPromises)
      
      // Sort by index to maintain correct order
      const generatedChapters = chapterResults
        .sort((a, b) => a.index - b.index)
        .map(({ title, content }) => ({ title, content }))
      
      setChapters(generatedChapters)
      setProgress({ current: 3, total: 3 })

      return generatedChapters
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