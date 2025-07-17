# Tech Stack

## Core Technologies

- **React 19.1.0** - Frontend framework
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 6.3.5** - Build tool and dev server
- **React Router DOM 7.6.2** - Client-side routing

## UI & Styling

- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **Radix UI** - Headless UI components (@radix-ui/react-\*)
- **Headless UI** - Additional accessible components
- **Lucide React** - Icon library
- **Vaul** - Drawer/modal components
- **shadcn/ui** - Pre-built component library (New York style)

## Utilities

- **clsx & tailwind-merge** - Conditional CSS classes
- **class-variance-authority** - Component variant management
- **date-fns** - Date manipulation
- **react-day-picker** - Date picker component

## Development Tools

- **ESLint** - Code linting with React hooks and refresh plugins
- **TypeScript ESLint** - TypeScript-specific linting rules

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production (TypeScript check + Vite build)
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Package management
npm install          # Install dependencies
```

## Build Configuration

- **Path aliases**: `@/` maps to `src/` directory
- **Tailwind CSS**: Integrated via Vite plugin
- **Asset handling**: Static assets in `public/assets/`
- **TypeScript**: Strict configuration with separate app and node configs
