from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import config
from app.api.deps import get_auth_service
from app.api.routes.accounts import router as accounts_router
from app.api.routes.audit import router as audit_router
from app.api.routes.auth import router as auth_router
from app.api.routes.customers import router as customers_router
from app.core.exceptions import (
    AccountHasBalanceError,
    AdminAccountProtectedError,
    CustomerHasAccountsError,
    DuplicateEmailError,
    DuplicateUsernameError,
    InsufficientFundsError,
    InvalidCredentialsError,
    NotAuthenticatedError,
    NotFoundError,
    PermissionDeniedError,
    ValidationError,
)



@asynccontextmanager
async def lifespan(app: FastAPI):
    # runs once at startup: make sure the admin account from .env exists
    get_auth_service().ensure_admin(
        config.ADMIN_USERNAME, config.ADMIN_PASSWORD, config.ADMIN_NAME, config.ADMIN_EMAIL
    )
    yield


app = FastAPI(title="Simple Bank Application", lifespan=lifespan)

# lets the React dev server (a different origin) call the API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router)
app.include_router(customers_router)
app.include_router(audit_router)
app.include_router(auth_router)


@app.exception_handler(NotFoundError)
def handle_not_found(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"error": str(exc)})


@app.exception_handler(ValidationError)
def handle_validation(request: Request, exc: ValidationError):
    return JSONResponse(status_code=400, content={"error": str(exc)})


@app.exception_handler(InsufficientFundsError)
def handle_insufficient_funds(request: Request, exc: InsufficientFundsError):
    return JSONResponse(status_code=409, content={"error": str(exc)})


@app.exception_handler(DuplicateEmailError)
def handle_duplicate_email(request: Request, exc: DuplicateEmailError):
    return JSONResponse(status_code=409, content={"error": str(exc)})


@app.exception_handler(CustomerHasAccountsError)
def handle_customer_has_accounts(request: Request, exc: CustomerHasAccountsError):
    return JSONResponse(status_code=409, content={"error": str(exc)})


@app.exception_handler(AccountHasBalanceError)
def handle_account_has_balance(request: Request, exc: AccountHasBalanceError):
    return JSONResponse(status_code=409, content={"error": str(exc)})


@app.exception_handler(DuplicateUsernameError)
def handle_duplicate_username(request: Request, exc: DuplicateUsernameError):
    return JSONResponse(status_code=409, content={"error": str(exc)})


@app.exception_handler(InvalidCredentialsError)
def handle_invalid_credentials(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(status_code=401, content={"error": str(exc)})


@app.exception_handler(NotAuthenticatedError)
def handle_not_authenticated(request: Request, exc: NotAuthenticatedError):
    return JSONResponse(status_code=401, content={"error": str(exc)})


@app.exception_handler(PermissionDeniedError)
def handle_permission_denied(request: Request, exc: PermissionDeniedError):
    return JSONResponse(status_code=403, content={"error": str(exc)})


@app.exception_handler(AdminAccountProtectedError)
def handle_admin_protected(request: Request, exc: AdminAccountProtectedError):
    return JSONResponse(status_code=409, content={"error": str(exc)})
