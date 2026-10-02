import re
from typing import List, Optional

from pymongo.errors import DuplicateKeyError

from app.core.exceptions import DuplicateEmailError, DuplicateUsernameError
from app.models.entities import User
from app.repositories.base import UserRepository
from app.repositories.mongo import db


def _to_user(doc: dict) -> User:
    return User(
        user_id=doc["_id"],
        name=doc["name"],
        email=doc["email"],
        username=doc.get("username"),
        password_hash=doc.get("password_hash"),
        # users stored before roles existed are customers
        role=doc.get("role", "customer"),
    )


def _duplicate_error(err: DuplicateKeyError, email: str, username: Optional[str]):
    # the same error type covers both unique indexes; keyPattern says which one
    if "username" in (err.details or {}).get("keyPattern", {}):
        return DuplicateUsernameError(f"Username {username} is already taken")
    return DuplicateEmailError(f"Email {email} is already in use")


class MongoUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        doc = db.users.find_one({"_id": user_id})
        if doc is None:
            return None
        return _to_user(doc)

    def find_all(self) -> List[User]:
        return [_to_user(doc) for doc in db.users.find()]

    def create(
        self,
        name: str,
        email: str,
        username: Optional[str] = None,
        password_hash: Optional[str] = None,
        role: str = "customer",
    ) -> User:
        user_id = db.get_next_id("user_id")
        doc = {"_id": user_id, "name": name, "email": email, "role": role}
        # leave login fields out entirely (not null) so the partial index skips them
        if username is not None:
            doc["username"] = username
            doc["password_hash"] = password_hash
        try:
            db.users.insert_one(doc)
        except DuplicateKeyError as err:
            raise _duplicate_error(err, email, username)
        return _to_user(doc)

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

    def find_by_username(self, username: str) -> Optional[User]:
        doc = db.users.find_one({"username": username})
        return _to_user(doc) if doc else None

    def find_by_first_name(self, first_name: str) -> List[User]:
        # start of name, case-insensitive; re.escape keeps input literal
        pattern = "^" + re.escape(first_name.strip())
        docs = db.users.find({"name": {"$regex": pattern, "$options": "i"}})
        return [_to_user(doc) for doc in docs]
