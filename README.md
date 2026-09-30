# Simple Bank Application (Python / FastAPI)

Implements section 5 of the project doc: REST API (Controller) -> Service Layer -> Repository.
Backed by MongoDB (Atlas). No frontend yet.

Note: the project doc specifies MySQL (§4.1); this uses MongoDB instead, as a deliberate
choice. The repository pattern (`app/repositories/base.py`) keeps the service layer and
API routes unaware of which database is behind them.

## Setup

    pip install -r requirements.txt
    cp .env.example .env

Edit `.env` and fill in your own MongoDB Atlas connection string as `MONGODB_URI`.
`.env` is gitignored and never committed.

## Run

    uvicorn app.main:app --reload --port 8000

Interactive API docs (Swagger UI): http://localhost:8000/docs

## Endpoints

- `POST /api/accounts` — create account (`{"userId": 1, "accountType": "SAVINGS"}`)
- `GET /api/accounts/{id}` — get account details
- `POST /api/accounts/{id}/deposit` — deposit (`{"amount": 500}`)
- `POST /api/accounts/{id}/withdraw` — withdraw (`{"amount": 200}`)
- `GET /api/accounts/{id}/transactions` — transaction history

Seeded users for testing: `userId` 1 (John Doe) and 2 (Jane Smith) — seeded automatically
into the `users` collection on first run if it's empty.
