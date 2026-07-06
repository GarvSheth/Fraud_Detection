# Fraud Detection Backend

## Prerequisites
- PostgreSQL installed locally
- A database named `fraud_db`
- Default user/password: `postgres` / `postgres`

## Run
1. Start PostgreSQL locally.
2. Create the database if it does not exist:
   ```bash
   createdb -U postgres fraud_db
   ```
3. From this folder, run:
   ```bash
   dotnet restore
   dotnet run
   ```

The app will automatically create the schema and seed initial data when it starts.

## Project Structure
- `Program.cs` starts the app and connects the main setup pieces.
- `Endpoints/` contains API routes grouped by feature, such as health, dashboard, users, threats, and audit logs.
- `Data/` contains Entity Framework database setup and seed data.
- `Models/` contains database entity classes.
- `Extensions/` contains reusable startup/service registration code.
- `DTOs/` is reserved for request and response shapes you can add when new APIs need clear input/output models.
- `Services/` is reserved for business logic that should not live directly inside API endpoints.

## Implemented APIs
- `GET /user/profile?userId=2`
- `PUT /user/profile?userId=2`
- `POST /user/accounts`
- `GET /threat/feed`
- `GET /threat/{id}`
- `POST /threat/evaluate`
- `POST /threat/resolve/{id}`
- `POST /threat/raise`
- `POST /threat/decision`
- `POST /notify/send`
- `POST /transaction/ingest`
- `GET /audit/logs`
- `GET /audit/logs/{id}`
- `POST /audit/record`

Auth APIs, Query APIs, and future-addition APIs are not implemented yet.
