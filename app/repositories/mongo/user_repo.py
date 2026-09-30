from typing import List, Optional

from pymongo.errors import DuplicateKeyError

from app.core.exceptions import DuplicateEmailError
from app.models.entities import User
from app.repositories.base import UserRepository
from app.repositories.mongo import db


def _to_user(doc: dict) -> User:
    return User(user_id=doc["_id"], name=doc["name"], email=doc["email"])


class MongoUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        doc = db.users.find_one({"_id": user_id})
        if doc is None:
            return None
        return _to_user(doc)

    def find_all(self) -> List[User]:
        return [_to_user(doc) for doc in db.users.find()]

    def create(self, name: str, email: str) -> User:
        user_id = db.get_next_id("user_id")
        try:
            db.users.insert_one({"_id": user_id, "name": name, "email": email})
        except DuplicateKeyError:
            raise DuplicateEmailError(f"Email {email} is already in use")
        return User(user_id=user_id, name=name, email=email)

    def update(self, user_id: int, name: str, email: str) -> Optional[User]:
        try:
            result = db.users.update_one(
                {"_id": user_id},
                {"$set": {"name": name, "email": email}},
            )
        except DuplicateKeyError:
            raise DuplicateEmailError(f"Email {email} is already in use")

        if result.matched_count == 0:
            return None
        return self.find_by_id(user_id)

    def delete(self, user_id: int) -> bool:
        result = db.users.delete_one({"_id": user_id})
        return result.deleted_count > 0
