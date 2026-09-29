from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.routes.accounts import router as accounts_router
from app.core.exceptions import InsufficientFundsError, NotFoundError, ValidationError

app = FastAPI(title="Simple Bank Application")

app.include_router(accounts_router)


@app.exception_handler(NotFoundError)
def handle_not_found(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"error": str(exc)})


@app.exception_handler(ValidationError)
def handle_validation(request: Request, exc: ValidationError):
    return JSONResponse(status_code=400, content={"error": str(exc)})


@app.exception_handler(InsufficientFundsError)
def handle_insufficient_funds(request: Request, exc: InsufficientFundsError):
    return JSONResponse(status_code=409, content={"error": str(exc)})
