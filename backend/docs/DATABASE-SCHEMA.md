# Database Schema
Nano Connect utilizes a PostgreSQL database to store and manage its data. This document provides an overview of the database schema, including tables, relationships, and key fields.

PostgreSQL is used since we only have to store registered dApps. Session and messages are stored in Redis for performance reasons.

## Tables

### Registered DApps
- **Table Name**: registered_apps
- **Description**: Stores information about decentralized applications (dApps) that are registered with the Nano Connect backend to prevent spam, unauthorized access and abuse.
- **Key Fields**:
  - `id` (UUID, Primary Key): Unique identifier for each registered dApp.
  - `name` (VARCHAR): Name of the dApp.
  - `domains` (TEXT[]): List of whitelisted domains associated with the dApp.
  - `client_id` (VARCHAR): Client identifier for the dApp.
  - `client_secret` (VARCHAR): Client secret for the dApp.
  - `logo_url` (VARCHAR): URL to the dApp's logo.
  - `status` (VARCHAR): Status of the dApp (e.g., active, inactive, banned).
  - `created_at` (TIMESTAMP): Timestamp of when the dApp was registered.
  - `updated_at` (TIMESTAMP): Timestamp of the last update to the dApp information.

## Relationships
Currently, the database schema primarily consists of the `registered_apps` table. Future expansions may introduce additional tables and relationships as needed.