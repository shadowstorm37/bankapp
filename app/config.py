import os

from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "bankapp")
# comma-separated origins allowed to call the API from a browser (the React app)
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
    ).split(",")
    if o.strip()
]


def _required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        _missing.append(name)
    return value


# login and admin settings have no defaults: the API won't start without them
_missing: list = []
JWT_SECRET = _required("JWT_SECRET")
_expire = _required("JWT_EXPIRE_MINUTES")
ADMIN_USERNAME = _required("ADMIN_USERNAME")
ADMIN_PASSWORD = _required("ADMIN_PASSWORD")
ADMIN_NAME = _required("ADMIN_NAME")
ADMIN_EMAIL = _required("ADMIN_EMAIL")

if _missing:
    raise RuntimeError(
        "Missing settings in .env: " + ", ".join(_missing) + ". See .env.example."
    )
if not _expire.isdigit() or int(_expire) <= 0:
    raise RuntimeError("JWT_EXPIRE_MINUTES must be a whole number of minutes above 0")
JWT_EXPIRE_MINUTES = int(_expire)
