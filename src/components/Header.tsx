import { Moon, Sun, BookOpen, FileText } from 'lucide-react'
import { Mode, Theme } from '../types'

interface HeaderProps {
  mode: Mode
  setMode: (mode: Mode) => void
  theme: Theme
  onThemeToggle: () => void
}

export const Header = ({ mode, setMode, theme, onThemeToggle }: HeaderProps) => {
  return (
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
            onClick={onThemeToggle}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}