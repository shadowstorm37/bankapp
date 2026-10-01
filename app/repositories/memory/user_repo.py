from typing import List, Optional

from app.core.exceptions import DuplicateEmailError, DuplicateUsernameError
from app.models.entities import User
from app.repositories.base import UserRepository
from app.repositories.memory import store


class InMemoryUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        return store.users.get(user_id)

    def find_all(self) -> List[User]:
        return list(store.users.values())

    def create(
        self,
        name: str,
        email: str,
        username: Optional[str] = None,
        password_hash: Optional[str] = None,
    ) -> User:
        if any(u.email == email for u in store.users.values()):
            raise DuplicateEmailError(f"Email {email} is already in use")
        if username is not None and self.find_by_username(username) is not None:
            raise DuplicateUsernameError(f"Username {username} is already taken")

        user = User(
            user_id=store.next_user_id,
            name=name,
            email=email,
            username=username,
            password_hash=password_hash,
        )
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

    def find_by_username(self, username: str) -> Optional[User]:
        return next(
            (u for u in store.users.values() if u.username == username), None
        )

    def find_by_first_name(self, first_name: str) -> List[User]:
        target = first_name.strip().lower()
        return [
            u
            for u in store.users.values()
            if u.name.split() and u.name.split()[0].lower() == target
        ]
