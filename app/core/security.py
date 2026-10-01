import bcrypt

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
