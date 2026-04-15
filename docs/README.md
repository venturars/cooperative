# Cooperative SDK Documentation

Starlight-based documentation for Cooperative SDK.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/           # Images, logos, etc.
├── content/docs/     # Documentation pages
│   ├── introduction.md
│   ├── installation.md
│   ├── configuration.md
│   ├── concepts/     # Core concepts
│   ├── guides/       # How-to guides
│   ├── api/          # API reference
│   └── development/  # Contributing & development
├── styles/           # Custom CSS
└── env.d.ts          # TypeScript definitions
```

## Adding Content

### New Page

1. Create a new `.md` file in the appropriate directory
2. Add frontmatter:
   ```markdown
   ---
   title: Page Title
   description: Brief description
   ---
   ```
3. Link it in `astro.config.mjs` sidebar

### API Reference

API pages should include:

- Function signature
- Parameters table
- Return type
- Examples
- Error handling

## Styling

Custom styles go in `src/styles/custom.css`. Use CSS variables for theming:

## Related

- [Cooperative SDK](https://github.com/venturars/cooperative)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build/)
