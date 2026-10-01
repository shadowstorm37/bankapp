from datetime import datetime
from typing import Tuple

from app.core.exceptions import InvalidCredentialsError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.entities import User
from app.repositories.base import UserRepository

# checked when the username doesn't exist, so an unknown username takes as long
# as a wrong password and response times don't reveal which usernames exist
_DUMMY_HASH = hash_password("not-a-real-password")


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, name: str, email: str, username: str, password: str) -> User:
        return self.user_repo.create(name, email, username, hash_password(password))

    def login(self, username: str, password: str) -> Tuple[User, str, datetime]:
        """Returns the user, a signed access token, and when the token expires."""
        user = self.user_repo.find_by_username(username)
        if user is None or user.password_hash is None:
            verify_password(password, _DUMMY_HASH)
            raise InvalidCredentialsError("Invalid username or password")
        if not verify_password(password, user.password_hash):
            raise InvalidCredentialsError("Invalid username or password")
        token, expires_at = create_access_token(user.user_id, user.role)
        return user, token, expires_at

    def ensure_admin(self, username: str, password: str, name: str, email: str) -> User:
        """Creates the admin account on startup if it doesn't exist yet."""
        existing = self.user_repo.find_by_username(username)
        if existing is not None:
            if existing.role != "admin":
                # never silently promote a customer who registered this username
                raise RuntimeError(
                    f"ADMIN_USERNAME '{username}' belongs to a customer account. "
                    "Pick a different ADMIN_USERNAME in .env."
                )
            return existing
        return self.user_repo.create(
            name, email, username, hash_password(password), role="admin"
        )
