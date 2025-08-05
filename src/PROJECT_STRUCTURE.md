# Project Structure Documentation

## Overview

This document describes the organized file structure of the Book.IA application after the refactoring from a monolithic approach to a modular, maintainable architecture.

## Directory Structure

```
src/
├── components/           # React components
│   ├── index.ts         # Component exports
│   ├── Header.tsx       # App header component
│   ├── InputForm.tsx    # Content generation form
│   ├── ContentPreview.tsx # Content display component
│   ├── Progress.tsx     # Loading progress component
│   ├── ModelSelect.tsx  # AI model selection component
│   └── README.md        # Components documentation
│
├── hooks/               # Custom React hooks
│   ├── useTheme.ts      # Theme management hook
│   └── useContentGeneration.ts # Content generation logic hook
│
├── types/               # TypeScript type definitions
│   └── index.ts         # All interface and type exports
│
├── constants/           # Application constants
│   └── models.ts        # AI model configurations
│
├── utils/               # Utility functions
│   ├── costCalculator.ts    # Cost estimation logic
│   ├── pdfGenerator.ts      # PDF export functionality
│   ├── clipboard.ts         # Clipboard operations
│   └── openAIService.ts     # OpenAI API integration
│
├── styles/              # Organized CSS modules
│   ├── index.css        # Main styles entry point
│   ├── variables.css    # CSS custom properties
│   ├── base.css         # Base styles and resets
│   ├── layout.css       # Layout and structural styles
│   ├── forms.css        # Form and input styles
│   ├── buttons.css      # Button styles
│   ├── progress.css     # Progress component styles
│   ├── content.css      # Content display styles
│   ├── responsive.css   # Responsive design styles
│   └── README.md        # Styles documentation
│
├── App.tsx              # Main application component (refactored)
├── App.css              # Main styles import file
├── index.css            # Global styles and fonts
├── main.tsx             # Application entry point
├── vite-env.d.ts        # Vite type definitions
└── PROJECT_STRUCTURE.md # This documentation file
```

## Architecture Principles

### 1. Separation of Concerns
- **Components**: UI rendering and user interaction
- **Hooks**: State management and side effects
- **Utils**: Pure functions and business logic
- **Types**: Type safety and interfaces
- **Constants**: Configuration and static data

### 2. Modularity
Each module has a specific purpose and can be developed/tested independently:
- React components are focused and reusable
- Utility functions are pure and testable
- Custom hooks encapsulate complex state logic
- Types ensure consistency across modules

### 3. Maintainability
- Clear file organization makes code easy to find
- Separation allows for easier debugging and updates
- TypeScript provides compile-time error checking
- Documentation explains the purpose of each module

## Key Refactoring Changes

### From Monolithic App.tsx (566 lines)
The original App.tsx contained:
- All component logic
- All utility functions
- All type definitions
- All constants
- Complex state management

### To Modular Architecture (51 lines)
The new App.tsx only contains:
- Main application orchestration
- High-level state coordination
- Component composition

### Benefits Achieved
- **Reduced Complexity**: Individual files are easier to understand
- **Better Testing**: Components and utilities can be tested in isolation
- **Improved Collaboration**: Multiple developers can work on different modules
- **Enhanced Reusability**: Components and utilities can be reused
- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Potential for code splitting and lazy loading

## Import Strategy

### Barrel Exports
Use index files for clean imports:
```typescript
// Good: Clean barrel import
import { Header, InputForm } from './components'
import { Mode, Theme } from './types'

// Avoid: Multiple individual imports
import { Header } from './components/Header'
import { InputForm } from './components/InputForm'
```

### Type-Only Imports
For TypeScript types when using strict mode:
```typescript
import type { Mode, ViewMode } from './types'
```

## Development Workflow

### Adding New Features
1. Determine the appropriate module (component, hook, util, etc.)
2. Create the new file in the correct directory
3. Add proper TypeScript types
4. Update barrel exports (index.ts files)
5. Add tests if applicable
6. Update documentation

### Modifying Existing Features
1. Locate the relevant module using this structure guide
2. Make changes within the appropriate separation of concerns
3. Update types if interfaces change
4. Test affected components
5. Update documentation if architecture changes

## Future Extensibility

This structure supports:
- **Component Libraries**: Easy extraction of reusable components
- **Code Splitting**: Lazy loading of feature modules
- **Micro-frontends**: Modular deployment strategies
- **Testing**: Unit and integration testing at multiple levels
- **Documentation**: Automated documentation generation
- **Linting**: Consistent code quality across modules