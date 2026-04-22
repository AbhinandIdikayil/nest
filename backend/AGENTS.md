# AGENTS.md

## Commands

```bash
yarn install
yarn run start        # development
yarn run start:dev    # watch mode (recommended)
yarn run start:prod   # production (node dist/main)
yarn run lint        # ESLint + auto-fix
yarn run format      # Prettier write
yarn run type-check # tsc --noEmit
yarn run test        # unit tests
yarn run test:e2e   # e2e tests
yarn run test:cov  # coverage
```

**Order**: lint -> type-check -> test -> build

## Database

PostgreSQL required. Connects via `src/common/database/data.source.ts` using TypeORM. Run migrations with:

```bash
yarn run typeorm:db migration:run
```

## Architecture

- Entry: `src/main.ts`
- Root module: `src/app.module.ts`
- Modules: `auth/`, `cart/`, `order/`, `payment/`, `product/`
- Entities: `src/common/entity/`

## Dependencies

- NestJS v11
- TypeORM with PostgreSQL
- JWT authentication
- ESLint + Prettier (lint-staged + husky on commit)
