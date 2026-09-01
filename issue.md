# Planning: New Project Setup

## Overview
Create a new backend project in this folder using Bun runtime with ElysiaJS, Drizzle ORM, and MySQL.

## Steps

1. **Initialize Project**
   - Run `bun init` to create `package.json`
   - Install dependencies: `elysia`, `drizzle-orm`, `mysql2`
   - Install dev dependencies: `drizzle-kit`, `@types/bun`

2. **Project Structure**
   - Create standard folder structure: `src/`, `src/db/`, `src/routes/`, `src/schemas/`
   - Set up entry point `src/index.ts` with basic Elysia server

3. **Database Setup**
   - Configure MySQL connection using environment variables
   - Create Drizzle schema files in `src/db/`
   - Set up Drizzle config file (`drizzle.config.ts`) for migrations

4. **Basic Features**
   - Health check endpoint (`GET /`)
   - Example CRUD route with one resource
   - Error handling middleware

5. **Configuration**
   - Add `.env.example` with database config template
   - Add `bunfig.toml` if needed