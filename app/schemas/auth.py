from pydantic import BaseModel, Field, field_validator

from app.core.security import MAX_PASSWORD_BYTES


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    email: str
    username: str = Field(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9._-]+$")
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def password_fits_bcrypt(cls, v: str) -> str:
        # measured in bytes, not characters: accented letters and emoji take more
        if len(v.encode()) > MAX_PASSWORD_BYTES:
            raise ValueError(f"password must be at most {MAX_PASSWORD_BYTES} bytes")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthUserResponse(BaseModel):
    userId: int
    name: str
    email: str
    username: str
