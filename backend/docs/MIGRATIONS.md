### Database Migrations

The backend uses TypeORM migrations to manage database schema changes. Follow these steps for database setup and migrations:

#### Initial Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database connection details

# Build the project (required for TypeORM CLI)
npm run build

# Run initial migrations
npm run migration:run
```

#### Migration Workflow

**Creating a new migration:**
```bash
# IMPORTANT: Always build before generating migrations
npm run build

# Generate migration based on entity changes
npm run migration:generate -- -n MigrationName

# Or create an empty migration file
npm run migration:create -- -n MigrationName
```

**Running migrations:**
```bash
# Run all pending migrations
npm run migration:run

# Show migration status
npm run migration:show
```

**Rolling back migrations:**
```bash
# Revert the last migration
npm run migration:revert

# Revert multiple migrations (run multiple times)
npm run migration:revert
npm run migration:revert
```

#### Migration Scripts

The following npm scripts are available in `backend/package.json`:

- `migration:generate` - Generate migration from entity changes (**requires build first**)
- `migration:create` - Create empty migration file
- `migration:run` - Execute pending migrations
- `migration:revert` - Rollback last migration
- `migration:show` - Display migration status

#### Best Practices

1. **Always build before generating migrations**: Run `npm run build` before `migration:generate`
2. **Always review generated migrations** before running them in production
3. **Test migrations** with `migration:run` and `migration:revert` in development
4. **Backup your database** before running migrations in production
5. **Never edit** already applied migration files
6. **Create new migrations** for schema changes instead of modifying existing ones

#### Common Workflow
```bash
# 1. Make changes to entities
# 2. Build the project
npm run build

# 3. Generate migration
npm run migration:generate -- -n AddUserTable

# 4. Review the generated migration file
# 5. Run migration
npm run migration:run

# 6. Test rollback (optional)
npm run migration:revert
npm run migration:run
```

#### Migration Files Location
```
backend/
├── src/database/migrations/           # Generated migration files
│   ├── 1699123456789-InitialSchema.ts
│   └── 1699123567890-AddIndexes.ts
└── dist/                     # Built files (required for TypeORM CLI)
```

#### Troubleshooting

**Error: "Cannot find module" when generating migrations**
- Solution: Run `npm run build` first

**Error: "No changes in database schema"**
- Ensure entities are properly exported and imported
- Verify entity decorators are correct
- Run `npm run build` and try again
