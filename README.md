# URL Analyzer

A simple Nuxt.js boilerplate demonstrating frontend to backend API interaction. This project showcases how to create a basic web application that can analyze URLs and return information about them.

## Features

- Modern Nuxt.js 3 setup with TypeScript
- Server-side API endpoint
- Simple and clean UI
- Error handling
- Loading states

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `components/` - Vue components
- `server/api/` - API endpoints
- `app.vue` - Main application component

## API Endpoint

The project includes a sample API endpoint at `/api/analyze-url` that accepts POST requests with a URL in the request body.

Example request:
```json
{
  "url": "https://example.com"
}
```

## Development

This project uses:
- Nuxt.js 3
- TypeScript
- Bun as the package manager

## License

MIT
