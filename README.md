# AI Customer Support

A Chat application with Admin dashboard built with Hono, TypeScript, and Hono JSX for customer support interactions.

## Prerequisites
- Node.js 18+ and Yarn package manager
- Cloudflare account

## Development

To develop locally:

Create a .`env` file

Copy the content of `.env.example` into the `.env`

Run the command below
```bash
yarn install
yarn db:push
yarn start
```

Open http://localhost:3000

## Testing

### End-to-End Tests

Comprehensive E2E testing with Playwright covering `/chat/new` and `/chat/view/{id}` routes.

```bash
# Run all E2E tests
yarn test:e2e

# Run essential tests (most reliable)
yarn test:e2e essential.spec.ts

# Run with UI mode (interactive)
yarn test:e2e:ui

# View test report
yarn test:e2e:report
```

**Available test suites:**
- `essential.spec.ts` - Core functionality (recommended for CI)
- `basic-smoke.spec.ts` - Quick smoke tests
- `chat-new.spec.ts` - New chat route tests
- `chat-view.spec.ts` - Chat view route tests
- `chat-flow.spec.ts` - Integration flow tests

See `tests/e2e/README.md` for detailed testing documentation.

## Database

```bash
# Generate migrations
yarn db:generate

# Push schema changes
yarn db:push

# Seed database
yarn db:seed
```

## Deployment

```bash
yarn install
vc deploy
```
