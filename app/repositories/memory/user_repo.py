from typing import Optional

from app.models.entities import User
from app.repositories.base import UserRepository
from app.repositories.memory import store


class InMemoryUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        return store.users.get(user_id)
