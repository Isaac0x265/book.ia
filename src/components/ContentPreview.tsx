import { useState } from 'react'
import { Download, Copy, Check, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Chapter, Mode } from '../types'
import { downloadPDF } from '../utils/pdfGenerator'
import { copyToClipboard } from '../utils/clipboard'

interface ContentPreviewProps {
  chapters: Chapter[]
  topic: string
  mode: Mode
  onReset: () => void
}

export const ContentPreview = ({ chapters, topic, mode, onReset }: ContentPreviewProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(chapters)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadPDF = () => {
    downloadPDF(chapters, topic, mode)
  }

  return (
    <div className="preview-section">
      <div className="preview-header">
        <h2>{topic} - {mode === 'ebook' ? 'Ebook' : 'Chapter Expansion'}</h2>
        <div className="preview-controls">
          <button className="control-btn" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
          <button className="control-btn" onClick={handleDownloadPDF}>
            <Download size={16} />
            Download PDF
          </button>
          <button className="control-btn" onClick={onReset}>
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
  )
}