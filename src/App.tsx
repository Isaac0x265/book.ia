import { useState, useEffect } from 'react'
import { Moon, Sun, BookOpen, FileText, Download, Eye, Loader2, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import jsPDF from 'jspdf'
import './App.css'

interface Chapter {
  title: string
  content: string
}

interface ModelOption {
  id: string
  name: string
  displayName: string
  inputCost: number // per 1M tokens
  outputCost: number // per 1M tokens
  description: string
  dangerLevel: 'safe' | 'moderate' | 'expensive' | 'danger'
}

type Mode = 'ebook' | 'chapter'
type Theme = 'dark' | 'light'

const MODELS: ModelOption[] = [
  {
    id: 'gpt-4o-mini',
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    inputCost: 0.15,
    outputCost: 0.60,
    description: 'Best value - Excellent quality, very cheap',
    dangerLevel: 'safe'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    inputCost: 0.50,
    outputCost: 1.50,
    description: 'Fast & cost-effective - Great for basic tasks',
    dangerLevel: 'safe'
  },
  {
    id: 'gpt-4o',
    name: 'gpt-4o',
    displayName: 'GPT-4o',
    inputCost: 5.00,
    outputCost: 15.00,
    description: 'Multimodal powerhouse - Text, images & audio',
    dangerLevel: 'moderate'
  },
  {
    id: 'gpt-4-turbo',
    name: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    inputCost: 10.00,
    outputCost: 30.00,
    description: 'Advanced reasoning - 128K context window',
    dangerLevel: 'expensive'
  },
  {
    id: 'gpt-4',
    name: 'gpt-4',
    displayName: 'GPT-4 (128K Context)',
    inputCost: 60.00,
    outputCost: 120.00,
    description: 'Extended context - Handle very long documents',
    dangerLevel: 'danger'
  }
]

function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mode, setMode] = useState<Mode>('ebook')
  const [topic, setTopic] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [viewMode, setViewMode] = useState<'input' | 'preview'>('input')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const calculateEstimatedCost = () => {
    const model = MODELS.find(m => m.id === selectedModel)
    if (!model) return { total: 0, description: '', dangerLevel: 'safe' as const }

    // Updated estimate: ~1800 words per chapter * 10 chapters = 18k words
    // More accurate estimate: 1 word ≈ 1.3 tokens
    const estimatedInputTokens = 2500 // prompts + context
    const estimatedOutputTokens = 25000 // ~18k words output (better quality, longer content)
    
    const inputCost = (estimatedInputTokens / 1000000) * model.inputCost
    const outputCost = (estimatedOutputTokens / 1000000) * model.outputCost
    const total = inputCost + outputCost

    let description = ''
    if (total < 0.05) {
      description = 'Ultra-cheap - Under 5¢'
    } else if (total < 0.15) {
      description = 'Very affordable - Under 15¢'
    } else if (total < 0.50) {
      description = 'Reasonable cost - Under 50¢'
    } else if (total < 1.50) {
      description = 'Moderate cost - $' + total.toFixed(2)
    } else if (total < 4.00) {
      description = 'Expensive - $' + total.toFixed(2)
    } else {
      description = 'VERY EXPENSIVE - $' + total.toFixed(2)
    }

    return { total, description, dangerLevel: model.dangerLevel }
  }

  const generateSubtopics = async (mainTopic: string): Promise<string[]> => {
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



  const generateChapterContent = async (subtopic: string, index: number): Promise<string> => {
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

  const generateContent = async () => {
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
      const subtopics = await generateSubtopics(topic)
      
      // Generate all chapters in parallel for much faster processing
      setProgress({ current: 2, total: 3 })
      
      const chapterPromises = subtopics.map((subtopic, i) => 
        generateChapterContent(subtopic, i).then(content => ({
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

      setViewMode('preview')
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Error generating content. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = async () => {
    const pdf = new jsPDF()
    const pageHeight = pdf.internal.pageSize.height
    const pageWidth = pdf.internal.pageSize.width
    let yPosition = 30

    // Cover page for ebook mode
    if (mode === 'ebook') {
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      const title = topic.toUpperCase()
      const titleWidth = pdf.getTextWidth(title)
      pdf.text(title, (pageWidth - titleWidth) / 2, 80)
      
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      const subtitle = 'AI-Generated Comprehensive Guide'
      const subtitleWidth = pdf.getTextWidth(subtitle)
      pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 100)
      
      pdf.setFontSize(12)
      const date = new Date().toLocaleDateString()
      const dateWidth = pdf.getTextWidth(date)
      pdf.text(date, (pageWidth - dateWidth) / 2, 120)
      
      pdf.addPage()
      yPosition = 30
    }

    chapters.forEach((chapter, index) => {
      if (index > 0 || mode === 'ebook') {
        if (yPosition > 50) {
          pdf.addPage()
          yPosition = 30
        }
      }

      // Chapter title with better formatting
      pdf.setFontSize(mode === 'ebook' ? 18 : 16)
      pdf.setFont('helvetica', 'bold')
      const cleanTitle = chapter.title.replace(/[^\w\s:\-\(\)]/g, '') // Remove emojis for PDF
      const titleLines = pdf.splitTextToSize(cleanTitle, 170)
      
      titleLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(line, 20, yPosition)
        yPosition += 12
      })
      
      yPosition += 8 // Extra spacing after title

      // Process content with better formatting
      const contentText = chapter.content
        .replace(/[#*_`]/g, '') // Remove markdown symbols
        .replace(/[^\w\s\.\,\!\?\:\;\(\)\-\n]/g, '') // Remove emojis and special chars
        .replace(/\n+/g, '\n\n') // Normalize line breaks
        .split('\n\n')

      contentText.forEach((paragraph: string) => {
        if (paragraph.trim()) {
          // Check if it's a header (starts with uppercase and is short)
          const isHeader = paragraph.length < 80 && paragraph.match(/^[A-Z][^.]*$/)
          
          if (isHeader) {
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            yPosition += 8
          } else {
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'normal')
          }

          const paragraphLines = pdf.splitTextToSize(paragraph.trim(), 170)
          
          paragraphLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage()
              yPosition = 30
            }
            pdf.text(line, 20, yPosition)
            yPosition += isHeader ? 8 : 6
          })
          
          yPosition += isHeader ? 4 : 8 // Extra spacing after headers/paragraphs
        }
      })
      
      yPosition += 15 // Space between chapters
    })

    // Footer on each page for ebook mode
    if (mode === 'ebook') {
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10)
        if (i > 1) { // Skip footer on cover page
          pdf.text(topic, 20, pageHeight - 10)
        }
      }
    }

    const fileName = `${topic.replace(/\s+/g, '_')}_${mode}_${new Date().getTime()}.pdf`
    pdf.save(fileName)
  }

  const resetApp = () => {
    setViewMode('input')
    setChapters([])
    setProgress({ current: 0, total: 0 })
  }

  const copyToClipboard = async () => {
    try {
      const fullContent = chapters.map(chapter => 
        `# ${chapter.title}\n\n${chapter.content}\n\n---\n\n`
      ).join('')
      
      await navigator.clipboard.writeText(fullContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>
            <BookOpen className="logo" />
            Book.IA
          </h1>
          
          <div className="controls">
            <button
              className={`mode-btn ${mode === 'ebook' ? 'active' : ''}`}
              onClick={() => setMode('ebook')}
            >
              <BookOpen size={16} />
              Ebook
            </button>
            <button
              className={`mode-btn ${mode === 'chapter' ? 'active' : ''}`}
              onClick={() => setMode('chapter')}
            >
              <FileText size={16} />
              Chapter
            </button>
            
            <button
              className="theme-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {viewMode === 'input' ? (
          <div className="input-section">
            <div className="form-container">
              <h2>Create your {mode === 'ebook' ? 'Ebook' : 'Chapter Expansion'}</h2>
              
              <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={mode === 'ebook' ? 'e.g., Boxing' : 'e.g., Advanced Boxing Techniques'}
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="apikey">OpenAI API Key</label>
                <input
                  id="apikey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="model">AI Model</label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isGenerating}
                  className="model-select"
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.displayName} - {model.description}
                    </option>
                  ))}
                </select>
                <div className={`cost-estimate ${calculateEstimatedCost().dangerLevel}`}>
                  <span className="cost-text">
                    Estimated cost: {calculateEstimatedCost().description}
                  </span>
                  {calculateEstimatedCost().dangerLevel === 'danger' && (
                    <span className="warning-text">⚠️ HIGH COST WARNING</span>
                  )}
                  {calculateEstimatedCost().dangerLevel === 'expensive' && (
                    <span className="warning-text">💰 Expensive model</span>
                  )}
                </div>
              </div>



              {isGenerating && (
                <div className="progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                  <p>
                    <Loader2 className="spinner" />
                    {progress.current === 1 && 'Creating subtopics...'}
                    {progress.current === 2 && 'Generating all chapters simultaneously...'}
                    {progress.current === 3 && 'Finalizing content...'}
                    {progress.current === 0 && 'Starting generation...'}
                    {' '}({progress.current}/{progress.total})
                  </p>
                </div>
              )}

              <button
                className="generate-btn"
                onClick={generateContent}
                disabled={isGenerating || !topic.trim() || !apiKey.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="spinner" />
                    Generating...
                  </>
                ) : (
                  `Generate ${mode === 'ebook' ? 'Ebook' : 'Chapter'}`
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="preview-section">
            <div className="preview-header">
              <h2>{topic} - {mode === 'ebook' ? 'Ebook' : 'Chapter Expansion'}</h2>
              <div className="preview-controls">
                <button className="control-btn" onClick={copyToClipboard}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
                <button className="control-btn" onClick={downloadPDF}>
                  <Download size={16} />
                  Download PDF
                </button>
                <button className="control-btn" onClick={resetApp}>
                  <BookOpen size={16} />
                  New {mode === 'ebook' ? 'Ebook' : 'Chapter'}
                </button>
              </div>
            </div>

            <div className="content-preview">
              {chapters.map((chapter, index) => (
                <div key={index} className="chapter">
                  <h2 className="chapter-title">{chapter.title}</h2>
                  <div className="chapter-content">
                    <ReactMarkdown>{chapter.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
