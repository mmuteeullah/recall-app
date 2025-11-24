# RE-CA-LL

**REmembering through CArds for Long-term Learning**

A modern spaced repetition learning app built as a Progressive Web App (PWA) with full offline capability. Perfect for learning programming, languages, and any knowledge that benefits from spaced repetition.

## Features

- **Spaced Repetition**: SM-2 algorithm for optimal review scheduling
- **Offline-First**: Full PWA support with IndexedDB storage
- **Markdown Support**: Import flashcards from markdown files
- **Nested Decks**: Organize cards in hierarchical deck structures
- **Dark Mode**: OLED-optimized dark theme
- **Mobile-Friendly**: Touch gestures and haptic feedback
- **Keyboard Shortcuts**: Efficient navigation and study
- **Statistics**: Track your learning progress over time

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Production Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Importing Flashcards

1. Navigate to the Import page
2. Drag and drop a markdown file (see `CARD_TEMPLATE.md` for format)
3. Review the parsed cards
4. Click Import

Sample flashcard collections are available in the `study-material/` folder.

## Tech Stack

- React 19 + TypeScript
- Vite build tool
- Tailwind CSS + Framer Motion
- IndexedDB (Dexie.js)
- React Router
- PWA with service worker

## License

MIT
