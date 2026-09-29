# Simple Bank Application (Python / FastAPI)

Implements section 5 of the project doc: REST API (Controller) -> Service Layer -> Repository.
No database yet (in-memory repository) and no frontend.

## Run

    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000

Interactive API docs (Swagger UI): http://localhost:8000/docs

## Endpoints

- `POST /api/accounts` — create account (`{"userId": 1, "accountType": "SAVINGS"}`)
- `GET /api/accounts/{id}` — get account details
- `POST /api/accounts/{id}/deposit` — deposit (`{"amount": 500}`)
- `POST /api/accounts/{id}/withdraw` — withdraw (`{"amount": 200}`)
- `GET /api/accounts/{id}/transactions` — transaction history

Seeded users for testing: `userId` 1 (John Doe) and 2 (Jane Smith).
