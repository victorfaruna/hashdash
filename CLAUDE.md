# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HashDash is a Next.js 15 memecoin launchpad for the Solana blockchain. It's a full-stack TypeScript application with PostgreSQL database, Supabase storage, and comprehensive Solana wallet integration.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations (Drizzle ORM)
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate     # Run migrations
npx drizzle-kit studio      # Database GUI
```

## Architecture Overview

### Frontend Architecture
- **App Router**: Next.js 15 with app directory structure
- **State Management**: Zustand for auth state (`src/store/auth.ts`)
- **Data Fetching**: TanStack React Query with Axios client
- **Wallet Integration**: Solana wallet adapter with multiple wallet support
- **Styling**: Tailwind CSS 4 + DaisyUI components

### Backend Architecture  
- **API Routes**: RESTful endpoints in `src/app/api/`
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with wallet-based auth flow
- **File Storage**: Supabase for token image uploads
- **Middleware**: JWT protection for `/api/user/*` routes

### Database Schema
Three main entities with relations:
- **Users**: wallet_address, username, is_verified
- **Tokens**: Complete token metadata, social links, market cap
- **Replies**: Comment system for tokens

## Key Components

### Authentication Flow
1. Wallet connection via Solana adapters (`src/providers/SolanaWallet.tsx`)
2. JWT generation in `/api/auth` endpoint
3. Token storage in Zustand auth store
4. Middleware protection for authenticated routes

### Token Management
- **Creation**: Multi-step form with image upload (`/launch`)
- **Display**: CoinList component with search and trending
- **API**: CRUD operations in `src/services/api/token.ts`
- **Smart Contract**: Solana program integration (mainnet configured)

### File Upload Workflow
- Supabase storage integration in API routes
- Form data handling with proper content-type headers
- Public URL generation for uploaded token images

## Environment Setup

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Storage configuration
- `JWT_SECRET`: Authentication token signing
- `RPC_ENDPOINT`: Solana network RPC URL

## Development Patterns

### API Routes
- Use `src/services/api/client.ts` Axios instance with JWT interceptors
- Protected routes use middleware authentication
- Consistent error handling with proper HTTP status codes

### State Management
- Auth state in `src/store/auth.ts` Zustand store
- Component-level state for forms and UI interactions
- React Query for server state caching

### Database Operations
- Use Drizzle ORM schema from `src/db/schema.ts`
- Connection via `src/db/index.ts` with Neon pooling
- Transactions for complex operations

### Solana Integration  
- Wallet provider wraps entire app
- Program keypair management for contract deployment
- Mainnet configuration (can switch to devnet/testnet)

## Common Gotchas

- JWT tokens require wallet signatures for generation
- Supabase file uploads need proper CORS configuration
- Database migrations must be run after schema changes
- Wallet disconnection clears auth state automatically
- Image uploads require form-data content-type handling