# Salamat-Jost

A modern Kanban board application built with Next.js, React, and TypeScript. This project demonstrates a fully functional task management system with drag-and-drop functionality, real-time state management, and local storage persistence.

## Features

- **Kanban Board**: Create and manage lists and cards in a classic Kanban layout
- **Drag & Drop**: Intuitive drag-and-drop interface using @dnd-kit for moving cards between lists
- **Real-time Updates**: Immediate UI updates with event-driven state management
- **Local Storage**: Persistent data storage in the browser
- **Comments**: Add comments to cards for collaboration
- **Seed Data**: Quickly populate the board with demo data
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: SCSS with modular component styles
- **State Management**: React Context with custom hooks
- **Drag & Drop**: @dnd-kit/core and related packages
- **Testing**: Vitest with React Testing Library
- **Linting & Formatting**: Biome
- **Icons**: React Icons
- **Notifications**: React Toastify

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salamat-jost
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. **Login**: Enter any username and password to access the board
2. **Create Lists**: Add new lists to organize your tasks
3. **Add Cards**: Create cards within lists to represent individual tasks
4. **Drag & Drop**: Move cards between lists by dragging them
5. **Edit Content**: Click on list or card titles to edit them inline
6. **Add Comments**: Open a card modal to add comments
7. **Seed Board**: Use the "Seed Board" button to populate with demo data

## Development

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run Biome linting
- `pnpm lint:biome` - Run Biome linting (alias)
- `pnpm format` - Format code with Biome
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run tests with Vitest
- `pnpm test:run` - Run tests once without watch mode

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── board/             # Board page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Login page
├── components/            # React components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── styles/                # SCSS stylesheets
├── utils/                 # Utility functions and types
├── docs/                  # Documentation and steps
└── AGENTS.md              # Development commands reference
```

### Code Style

- **Imports**: Use absolute paths with `@/` alias
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Formatting**: 2 spaces indentation, semicolons, single quotes
- **Types**: Explicit types for props and return values
- **Error Handling**: Try-catch for async operations, throw Error objects

## Testing

Run the test suite:

```bash
pnpm test
```

Tests are located in `contexts/__tests__/` and use Vitest with React Testing Library.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC