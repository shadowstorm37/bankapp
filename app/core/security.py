from datetime import datetime, timedelta, timezone
from typing import Tuple

import bcrypt
import jwt

from app import config
from app.core.exceptions import NotAuthenticatedError

# bcrypt only reads the first 72 bytes of a password; RegisterRequest enforces this
MAX_PASSWORD_BYTES = 72


def hash_password(password: str) -> str:
    # gensalt() picks a random salt and the default cost (12 rounds); both are
    # stored inside the hash string, e.g. "$2b$12$<salt><hash>"
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, stored: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), stored.encode())
    except ValueError:
        # malformed stored hash, or a password bcrypt refuses (over 72 bytes)
        return False


# signing algorithm: HMAC-SHA256 with JWT_SECRET (only this server can sign)
_JWT_ALGORITHM = "HS256"


def create_access_token(user_id: int, role: str) -> Tuple[str, datetime]:
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(minutes=config.JWT_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "iat": issued_at, "exp": expires_at}
    token = jwt.encode(payload, config.JWT_SECRET, algorithm=_JWT_ALGORITHM)
    return token, expires_at


def decode_access_token(token: str) -> int:
    """Returns the user id in a valid token; raises NotAuthenticatedError if the
    token is malformed, signed with another secret, or expired."""
    try:
        payload = jwt.decode(token, config.JWT_SECRET, algorithms=[_JWT_ALGORITHM])
        return int(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise NotAuthenticatedError("Your session has expired. Please log in again.")
    except (jwt.PyJWTError, KeyError, ValueError):
        raise NotAuthenticatedError("Invalid login token. Please log in again.")
