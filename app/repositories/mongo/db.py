from pymongo import MongoClient

from app import config

if not config.MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is not set. Copy .env.example to .env and fill in your "
        "MongoDB Atlas connection string."
    )

client = MongoClient(config.MONGODB_URI, tz_aware=True)
db = client[config.MONGO_DB_NAME]

counters = db["counters"]
users = db["users"]
accounts = db["accounts"]
transactions = db["transactions"]
audit = db["audit"]


def get_next_id(counter_name: str) -> int:
    result = counters.find_one_and_update(
        {"_id": counter_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    return result["seq"]


def seed_users() -> None:
    if users.count_documents({}) == 0:
        users.insert_many(
            [
                {"_id": 1, "name": "John Doe", "email": "john@example.com"},
                {"_id": 2, "name": "Jane Smith", "email": "jane@example.com"},
            ]
        )

    # Seed ids 1/2 are inserted directly above, bypassing get_next_id(). Make sure
    # the "user_id" counter starts after them so the first real create() doesn't
    # collide with a seeded id.
    counters.update_one(
        {"_id": "user_id"},
        {"$setOnInsert": {"seq": 2}},
        upsert=True,
    )


users.create_index("email", unique=True)
# one index per audit lookup: by account (either side), by user, by transaction
audit.create_index("from_account_id")
audit.create_index("to_account_id")
audit.create_index("user_id")
audit.create_index("transaction_ids")
seed_users()
