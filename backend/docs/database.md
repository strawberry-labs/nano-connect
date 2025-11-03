# Database Setup
This document outlines the steps to set up and configure the PostgreSQL database for the Nano Connect backend application.

## Prerequisites
- PostgreSQL installed on your local machine or a remote server.
- Basic knowledge of SQL and database management.

## Step 1: Install PostgreSQL
Docker is the recommended way to run PostgreSQL for development purposes. Use the following command to start a PostgreSQL container:

```sh
docker run -d --name nanoconnect-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nanoconnect -p 5432:5432 postgres
```

### Linux
```bash
docker run -d \
  --name nanoconnect-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nanoconnect \
  -p 5432:5432 \
  postgres
```

### Windows
```shell
docker run -d --name nanoconnect-postgres `
  -e POSTGRES_USER=user `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=nanoconnect `
  -p 5432:5432 `
  postgres
```

You can replace `user`, `password`, and `nanoconnect` with your preferred PostgreSQL username, password, and database name.

## Step 2: Configure Environment Variables
Update the `.env` file in the `backend` directory with your PostgreSQL connection details (`DATABASE_URL`).
If you run the same command as above, you can use `.env.example` with no changes.
