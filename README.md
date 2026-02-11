# Core Nest CMS

A full-stack application with a Next.js client and Express backend.

## Project Structure

```
├── client/          # Next.js frontend application
│   ├── src/
│   │   └── app/     # App Router pages
│   ├── package.json
│   └── tsconfig.json
├── backend/         # Express backend API
│   ├── src/
│   │   └── index.ts # Main server entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The backend will run on http://localhost:5000

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The client will run on http://localhost:3000

## Available Scripts

### Backend

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Run production build

### Client

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint

## Branch Structure

- `main` - Production-ready code
- `testing` - Testing and QA branch
- `dev` - Active development branch
