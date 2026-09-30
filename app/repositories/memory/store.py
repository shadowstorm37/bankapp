from app.models.entities import User

# Seed a couple of users so /api/accounts (which takes a userId) is testable
# without a POST /api/users endpoint yet.
users: dict[int, User] = {
    1: User(user_id=1, name="John Doe", email="john@example.com"),
    2: User(user_id=2, name="Jane Smith", email="jane@example.com"),
}

accounts: dict[int, "Account"] = {}
transactions: dict[int, "Transaction"] = {}

next_account_id = 1
next_txn_id = 1
next_user_id = 3
