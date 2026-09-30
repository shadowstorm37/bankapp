from typing import Optional

from app.models.entities import User
from app.repositories.base import UserRepository
from app.repositories.mongo import db


class MongoUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        doc = db.users.find_one({"_id": user_id})
        if doc is None:
            return None
        return User(user_id=doc["_id"], name=doc["name"], email=doc["email"])
