from fastapi import APIRouter, Depends

from app.api.deps import get_account_service
from app.schemas.account import (
    AccountResponse,
    AmountRequest,
    CreateAccountRequest,
    TransactionResponse,
)
from app.services.account_service import AccountService

router = APIRouter(prefix="/api/accounts", tags=["accounts"])


def _to_account_response(account, service: AccountService) -> AccountResponse:
    user = service.user_repo.find_by_id(account.user_id)
    return AccountResponse(
        accountId=account.account_id,
        userName=user.name if user else "",
        accountType=account.account_type,
        balance=account.balance,
    )


@router.post("", response_model=AccountResponse, status_code=201)
def create_account(
    body: CreateAccountRequest,
    service: AccountService = Depends(get_account_service),
):
    account = service.create_account(body.userId, body.accountType)
    return _to_account_response(account, service)


@router.get("/{account_id}", response_model=AccountResponse)
def get_account(
    account_id: int,
    service: AccountService = Depends(get_account_service),
):
    account = service.get_account(account_id)
    return _to_account_response(account, service)


@router.post("/{account_id}/deposit", response_model=AccountResponse)
def deposit(
    account_id: int,
    body: AmountRequest,
    service: AccountService = Depends(get_account_service),
):
    account = service.deposit(account_id, body.amount)
    return _to_account_response(account, service)


@router.post("/{account_id}/withdraw", response_model=AccountResponse)
def withdraw(
    account_id: int,
    body: AmountRequest,
    service: AccountService = Depends(get_account_service),
):
    account = service.withdraw(account_id, body.amount)
    return _to_account_response(account, service)


@router.get("/{account_id}/transactions", response_model=list[TransactionResponse])
def get_transactions(
    account_id: int,
    service: AccountService = Depends(get_account_service),
):
    txns = service.get_transactions(account_id)
    return [
        TransactionResponse(
            txnId=t.txn_id, type=t.txn_type, amount=t.amount, date=t.created_at
        )
        for t in txns
    ]
