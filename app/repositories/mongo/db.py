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


def get_next_id(counter_name: str) -> int:
    result = counters.find_one_and_update(
        {"_id": counter_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    return result["seq"]


def seed_users() -> None:
    if users.count_documents({}) > 0:
        return
    users.insert_many(
        [
            {"_id": 1, "name": "John Doe", "email": "john@example.com"},
            {"_id": 2, "name": "Jane Smith", "email": "jane@example.com"},
        ]
    )


seed_users()
