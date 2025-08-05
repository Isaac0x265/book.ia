import { Chapter } from '../types'

export const copyToClipboard = async (chapters: Chapter[]): Promise<boolean> => {
  try {
    const fullContent = chapters.map(chapter => 
      `# ${chapter.title}\n\n${chapter.content}\n\n---\n\n`
    ).join('')
    
    await navigator.clipboard.writeText(fullContent)
    return true
  } catch (error) {
    console.error('Failed to copy content:', error)
    return false
  }
}