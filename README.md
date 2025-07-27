# Book.IA - AI-Powered Ebook Creator

A React + Vite application that generates comprehensive ebooks and chapter expansions using OpenAI's GPT models.

## Features

- **Dual Mode Operation**: Create full ebooks or expand specific topics
- **Dark/Light Theme**: Beautiful UI with theme switching (defaults to dark)
- **AI-Powered Content**: Uses OpenAI GPT-3.5-turbo for content generation
- **Progress Tracking**: Real-time loading indicators during generation
- **Multiple Output Formats**: 
  - In-app markdown preview
  - PDF download
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Get OpenAI API Key**:
   - Visit [OpenAI API](https://platform.openai.com/api-keys)
   - Create a new API key
   - Keep it handy for the app

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## How It Works

### Ebook Mode
- Input a broad topic (e.g., "Boxing")
- AI breaks it into 10 subtopics
- Each subtopic becomes a chapter with 1200+ words
- Chapters are properly numbered and formatted

### Chapter Expansion Mode
- Input a specific topic to expand
- AI breaks it into 10 detailed sections
- Each section gets 1200+ words of detailed content
- Avoids chapter numbering for standalone use

## Content Generation Process

1. **Topic Breakdown**: AI analyzes your topic and creates 10 relevant subtopics
2. **Content Creation**: For each subtopic, AI generates detailed, expert-level content
3. **Quality Assurance**: Each section targets 1200+ words for comprehensive coverage
4. **Formatting**: Content is generated in markdown for rich formatting

## Usage Tips

- Use descriptive topics for better results
- Ebook mode works best with broad subjects
- Chapter expansion mode is ideal for specific topics
- Generated content can be viewed in-app or downloaded as PDF
- Dark theme is easier on the eyes for long reading sessions

## Technical Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with custom properties for theming
- **AI Integration**: OpenAI GPT-3.5-turbo API
- **PDF Generation**: jsPDF
- **Markdown Rendering**: react-markdown
- **Icons**: Lucide React

## Estimated Costs

Using GPT-3.5-turbo (cheapest OpenAI model):
- Full ebook (~12-15k words): ~$0.15-0.25
- Chapter expansion: ~$0.10-0.20

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.
