# Project Structure

## Root Directory

- `src/` - Main application source code
- `public/` - Static assets and HTML template
- `node_modules/` - Dependencies
- Configuration files: `vite.config.ts`, `tsconfig.*.json`, `eslint.config.js`, `components.json`

## Source Code Organization (`src/`)

### Core Files

- `main.tsx` - Application entry point with React Router setup
- `App.tsx` - Main app component (currently minimal)
- `routes.tsx` - React Router configuration with all route definitions
- `index.css` - Global styles and Tailwind imports
- `vite-env.d.ts` - Vite type definitions

### Component Architecture

```
src/
├── components/
│   └── ui/           # Reusable UI components (shadcn/ui)
├── pages/            # Page-level components organized by route
│   ├── about/
│   ├── booking/
│   ├── contacts/
│   ├── events/
│   ├── menu/         # Complex feature with sub-structure
│   │   ├── components/    # Menu category components
│   │   ├── modals/        # Menu-specific modals
│   │   ├── data.ts        # Menu data
│   │   ├── types.ts       # Menu type definitions
│   │   ├── menu.tsx       # Main menu page
│   │   └── menu-layout.tsx # Menu layout wrapper
│   └── not-found/
└── lib/
    └── utils.ts      # Utility functions (cn helper, etc.)
```

## Naming Conventions

- **Files**: kebab-case (e.g., `main-courses.tsx`, `not-found.tsx`)
- **Components**: PascalCase exports, kebab-case filenames
- **Directories**: kebab-case for multi-word names
- **Routes**: kebab-case URLs (e.g., `/main-courses`, `/not-found`)

## Asset Organization

- `public/assets/` - All images and media files
- Images follow descriptive naming: `appetizers-1.jpg`, `pizza-2.jpg`
- Static assets accessible via `/assets/` URL path

## Routing Pattern

- File-based organization matches route structure
- Nested routes use layout components (`menu-layout.tsx`)
- Error boundaries with `NotFound` component
- Dynamic routes with params (e.g., `/menu/:categoryId`)

## Component Patterns

- Page components in dedicated folders
- Feature-specific components grouped with their pages
- Shared UI components in `components/ui/`
- Type definitions co-located with features when complex
