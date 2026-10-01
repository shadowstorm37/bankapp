from functools import lru_cache
from typing import Optional

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import NotAuthenticatedError, PermissionDeniedError
from app.core.security import decode_access_token
from app.models.entities import Account, User
from app.repositories.mongo.account_repo import MongoAccountRepository
from app.repositories.mongo.audit_repo import MongoAuditRepository
from app.repositories.mongo.transaction_repo import MongoTransactionRepository
from app.repositories.mongo.user_repo import MongoUserRepository
from app.services.account_service import AccountService
from app.services.audit_service import AuditService
from app.services.auth_service import AuthService
from app.services.customer_service import CustomerService

_user_repo = MongoUserRepository()
_account_repo = MongoAccountRepository()
_transaction_repo = MongoTransactionRepository()
_audit_repo = MongoAuditRepository()
_audit_service = AuditService(_audit_repo, _user_repo)


@lru_cache
def get_account_service() -> AccountService:
    return AccountService(_user_repo, _account_repo, _transaction_repo, _audit_service)


@lru_cache
def get_customer_service() -> CustomerService:
    return CustomerService(_user_repo, _account_repo)


def get_audit_service() -> AuditService:
    return _audit_service


@lru_cache
def get_auth_service() -> AuthService:
    return AuthService(_user_repo)


# --- who is calling, and what they may do ---

# auto_error=False: a missing header reaches get_current_user, which answers
# with our own 401 message instead of FastAPI's default
_bearer = HTTPBearer(
    auto_error=False,
    description="Paste the accessToken returned by POST /api/auth/login",
)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> User:
    if credentials is None:
        raise NotAuthenticatedError("Please log in")
    user_id = decode_access_token(credentials.credentials)
    # load the user on every request, so a deleted user's token stops working
    user = _user_repo.find_by_id(user_id)
    if user is None:
        raise NotAuthenticatedError(
            "Your account no longer exists. Please log in again."
        )
    return user


def require_admin(current: User = Depends(get_current_user)) -> User:
    if current.role != "admin":
        raise PermissionDeniedError("Admins only")
    return current


def require_self_or_admin(
    user_id: int, current: User = Depends(get_current_user)
) -> User:
    """For /api/customers/{user_id}...: customers may only use their own id."""
    if current.role != "admin" and current.user_id != user_id:
        raise PermissionDeniedError("You can only access your own profile")
    return current


def get_accessible_account(
    account_id: int,
    current: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service),
) -> Account:
    """For /api/accounts/{account_id}...: 404 if it doesn't exist, 403 if it
    belongs to another customer."""
    account = service.get_account(account_id)
    if current.role != "admin" and account.user_id != current.user_id:
        raise PermissionDeniedError("You can only access your own accounts")
    return account
