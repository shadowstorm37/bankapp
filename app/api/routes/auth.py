from fastapi import APIRouter, Depends

from app.api.deps import get_auth_service
from app.schemas.auth import AuthUserResponse, LoginRequest, LoginResponse, RegisterRequest
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_auth_response(user) -> AuthUserResponse:
    # deliberately no password or hash in the response
    return AuthUserResponse(
        userId=user.user_id,
        name=user.name,
        email=user.email,
        username=user.username,
        role=user.role,
    )


@router.post("/register", response_model=AuthUserResponse, status_code=201)
def register(
    body: RegisterRequest,
    service: AuthService = Depends(get_auth_service),
):
    user = service.register(body.name, body.email, body.username, body.password)
    return _to_auth_response(user)


@router.post("/login", response_model=LoginResponse)
def login(
    body: LoginRequest,
    service: AuthService = Depends(get_auth_service),
):
    user, token, expires_at = service.login(body.username, body.password)
    return LoginResponse(
        accessToken=token,
        tokenType="bearer",
        expiresAt=expires_at,
        user=_to_auth_response(user),
    )
