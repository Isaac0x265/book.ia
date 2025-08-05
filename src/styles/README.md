# Styles Organization

This directory contains the organized CSS files for the Book.IA application. The original monolithic `App.css` has been split into modular, maintainable files.

## File Structure

```
src/styles/
├── index.css           # Main entry point (imports all modules)
├── variables.css       # CSS custom properties and theme variables
├── base.css           # Reset styles, base typography, and animations
├── layout.css         # App layout, header, main content, and grid systems
├── forms.css          # Form controls, inputs, selects, and validation styles
├── buttons.css        # Button styles and interactive elements
├── progress.css       # Progress bars and loading indicators
├── content.css        # Content preview, chapters, and markdown styling
├── responsive.css     # Media queries and responsive design
└── README.md         # This documentation file
```

## Import Order

The CSS files should be imported in this specific order to ensure proper cascade and specificity:

1. **variables.css** - CSS custom properties (needed by all other files)
2. **base.css** - Reset and base styles
3. **layout.css** - Layout and structural styles
4. **Component styles** (forms.css, buttons.css, progress.css, content.css)
5. **responsive.css** - Media queries (last to override previous styles)

## Usage

You can import all styles in two ways:

### Option 1: Import the main App.css (recommended)
```css
@import '../App.css';
```

### Option 2: Import the styles index directly
```css
@import './styles/index.css';
```

### Option 3: Import individual modules (for specific components)
```css
@import './styles/variables.css';
@import './styles/buttons.css';
```

## Theme System

The application uses CSS custom properties for theming:

- **Dark theme** (default): Defined in `:root`
- **Light theme**: Defined in `[data-theme="light"]`

Variables include colors, spacing, and component-specific values.

## Benefits of This Organization

- **Maintainability**: Easier to find and modify specific styles
- **Modularity**: Import only what you need
- **Collaboration**: Multiple developers can work on different style modules
- **Performance**: Potential for selective loading in the future
- **Debugging**: Easier to identify which file contains specific styles

## Adding New Styles

When adding new styles:

1. Determine the appropriate module (or create a new one)
2. Follow the existing naming conventions
3. Use CSS custom properties from `variables.css`
4. Add responsive styles to `responsive.css`
5. Update this README if adding new modules