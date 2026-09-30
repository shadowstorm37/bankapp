from typing import List, Optional

from app.core.exceptions import DuplicateEmailError
from app.models.entities import User
from app.repositories.base import UserRepository
from app.repositories.memory import store


class InMemoryUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        return store.users.get(user_id)

    def find_all(self) -> List[User]:
        return list(store.users.values())

    def create(self, name: str, email: str) -> User:
        if any(u.email == email for u in store.users.values()):
            raise DuplicateEmailError(f"Email {email} is already in use")

        user = User(user_id=store.next_user_id, name=name, email=email)
        store.users[user.user_id] = user
        store.next_user_id += 1
        return user

    def update(self, user_id: int, name: str, email: str) -> Optional[User]:
        user = store.users.get(user_id)
        if user is None:
            return None

        if any(u.email == email for u in store.users.values() if u.user_id != user_id):
            raise DuplicateEmailError(f"Email {email} is already in use")

        user.name = name
        user.email = email
        return user

    def delete(self, user_id: int) -> bool:
        if user_id in store.users:
            del store.users[user_id]
            return True
        return False
