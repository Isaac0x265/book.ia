# Components Documentation

This directory contains the modular React components for the Book.IA application. The original monolithic App.tsx has been refactored into reusable, maintainable components.

## Component Structure

```
src/components/
├── index.ts                # Central export file for all components
├── Header.tsx              # App header with branding and controls
├── InputForm.tsx           # Main form for content generation
├── ContentPreview.tsx      # Content display and export controls
├── Progress.tsx            # Loading progress indicator
├── ModelSelect.tsx         # AI model selection with cost estimation
└── README.md              # This documentation file
```

## Component Overview

### Header
**File:** `Header.tsx`
**Purpose:** App header with navigation and theme controls
**Props:**
- `mode`: Current generation mode (ebook/chapter)
- `setMode`: Function to change mode
- `theme`: Current theme (dark/light)
- `onThemeToggle`: Function to toggle theme

### InputForm
**File:** `InputForm.tsx`
**Purpose:** Main form for content generation with all input controls
**Props:**
- `mode`: Generation mode
- `topic`: Current topic input
- `setTopic`: Function to update topic
- `apiKey`: OpenAI API key
- `setApiKey`: Function to update API key
- `selectedModel`: Currently selected AI model
- `setSelectedModel`: Function to change model
- `isGenerating`: Loading state
- `progress`: Generation progress data
- `onGenerate`: Function to start generation

### ContentPreview
**File:** `ContentPreview.tsx`
**Purpose:** Display generated content with export options
**Props:**
- `chapters`: Array of generated chapters
- `topic`: Content topic
- `mode`: Generation mode
- `onReset`: Function to return to input view

### Progress
**File:** `Progress.tsx`
**Purpose:** Visual progress indicator with status messages
**Props:**
- `progress`: Progress data with current/total steps

### ModelSelect
**File:** `ModelSelect.tsx`
**Purpose:** AI model selection dropdown with cost estimation
**Props:**
- `selectedModel`: Currently selected model ID
- `onModelChange`: Function to change model
- `models`: Array of available models
- `disabled`: Whether the select is disabled

## Usage

Import components from the central index file:

```typescript
import { Header, InputForm, ContentPreview } from './components'
```

Or import individually:

```typescript
import { Header } from './components/Header'
import { InputForm } from './components/InputForm'
```

## Component Dependencies

### External Dependencies
- `react`: Core React hooks and components
- `lucide-react`: Icon components
- `react-markdown`: Markdown rendering

### Internal Dependencies
- `../types`: TypeScript type definitions
- `../constants/models`: Model configuration
- `../utils/*`: Utility functions
- `../hooks/*`: Custom React hooks

## Benefits of This Structure

- **Modularity**: Each component has a single responsibility
- **Reusability**: Components can be reused across the app
- **Maintainability**: Easy to locate and modify specific functionality
- **Testing**: Components can be tested in isolation
- **Type Safety**: Full TypeScript support with proper prop interfaces
- **Separation of Concerns**: UI logic separated from business logic

## Adding New Components

When adding new components:

1. Create the component file in `src/components/`
2. Define proper TypeScript interfaces for props
3. Add the export to `index.ts`
4. Update this README with component documentation
5. Follow the existing naming and structure conventions