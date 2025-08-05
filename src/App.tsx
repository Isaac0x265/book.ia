import { useState } from 'react'
import type { Mode, ViewMode } from './types'
import { useTheme } from './hooks/useTheme'
import { useContentGeneration } from './hooks/useContentGeneration'
import { Header, InputForm, ContentPreview } from './components'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { isGenerating, progress, chapters, generateContent, resetGeneration } = useContentGeneration()
  
  const [mode, setMode] = useState<Mode>('ebook')
  const [topic, setTopic] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini')
  const [viewMode, setViewMode] = useState<ViewMode>('input')

  const handleGenerate = async () => {
    try {
      const result = await generateContent(topic, apiKey, selectedModel, mode)
      if (result) {
        setViewMode('preview')
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleReset = () => {
    setViewMode('input')
    resetGeneration()
  }

  return (
    <div className="app">
      <Header 
        mode={mode}
        setMode={setMode}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="main">
        {viewMode === 'input' ? (
          <InputForm
            mode={mode}
            topic={topic}
            setTopic={setTopic}
            apiKey={apiKey}
            setApiKey={setApiKey}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isGenerating={isGenerating}
            progress={progress}
            onGenerate={handleGenerate}
          />
        ) : (
          <ContentPreview
            chapters={chapters}
            topic={topic}
            mode={mode}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App