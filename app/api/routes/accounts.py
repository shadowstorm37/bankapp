from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, Query

from app.api.deps import (
    get_accessible_account,
    get_account_service,
    get_current_user,
    require_admin,
)
from app.models.entities import User
from app.schemas.account import (
    AccountResponse,
    AmountRequest,
    CreateAccountRequest,
    TransactionResponse,
    TransferRequest,
    TransferResponse,
    UpdateAccountRequest,
)
from app.services.account_service import AccountService

router = APIRouter(prefix="/api/accounts", tags=["accounts"])

# Admin-only routes use require_admin. Routes on one account use
# get_accessible_account: the owner or an admin. For a transfer that's the
# source account; the destination can belong to anyone.


def _to_account_response(account, service: AccountService) -> AccountResponse:
    user = service.user_repo.find_by_id(account.user_id)
    return AccountResponse(
        accountId=account.account_id,
        userName=user.name if user else "",
        accountType=account.account_type,
        balance=account.balance,
    )


@router.post(
    "",
    response_model=AccountResponse,
    status_code=201,
    dependencies=[Depends(require_admin)],
)
def create_account(
    body: CreateAccountRequest,
    service: AccountService = Depends(get_account_service),
):
    account = service.create_account(body.userId, body.accountType)
    return _to_account_response(account, service)


@router.get(
    "",
    response_model=List[AccountResponse],
    dependencies=[Depends(require_admin)],
)
def list_accounts(service: AccountService = Depends(get_account_service)):
    return [_to_account_response(a, service) for a in service.list_accounts()]


# must be registered before /{account_id}, or "premium" is parsed as an account_id
@router.get(
    "/premium",
    response_model=List[AccountResponse],
    dependencies=[Depends(require_admin)],
)
def get_premium_accounts(
    threshold: Decimal = Query(ge=0),
    service: AccountService = Depends(get_account_service),
):
    return [
        _to_account_response(a, service)
        for a in service.get_premium_accounts(threshold)
    ]


@router.get(
    "/{account_id}",
    response_model=AccountResponse,
    dependencies=[Depends(get_accessible_account)],
)
def get_account(
    account_id: int,
    service: AccountService = Depends(get_account_service),
):
    account = service.get_account(account_id)
    return _to_account_response(account, service)


@router.put(
    "/{account_id}",
    response_model=AccountResponse,
    dependencies=[Depends(require_admin)],
)
def update_account(
    account_id: int,
    body: UpdateAccountRequest,
    service: AccountService = Depends(get_account_service),
):
    account = service.update_account(account_id, body.accountType)
    return _to_account_response(account, service)


@router.delete("/{account_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_account(
    account_id: int,
    service: AccountService = Depends(get_account_service),
):
    service.delete_account(account_id)


@router.post(
    "/{account_id}/deposit",
    response_model=AccountResponse,
    dependencies=[Depends(get_accessible_account)],
)
def deposit(
    account_id: int,
    body: AmountRequest,
    service: AccountService = Depends(get_account_service),
    current: User = Depends(get_current_user),
):
    account = service.deposit(account_id, body.amount, current)
    return _to_account_response(account, service)


@router.post(
    "/{account_id}/withdraw",
    response_model=AccountResponse,
    dependencies=[Depends(get_accessible_account)],
)
def withdraw(
    account_id: int,
    body: AmountRequest,
    service: AccountService = Depends(get_account_service),
    current: User = Depends(get_current_user),
):
    account = service.withdraw(account_id, body.amount, current)
    return _to_account_response(account, service)


@router.post(
    "/{account_id}/transfer",
    response_model=TransferResponse,
    dependencies=[Depends(get_accessible_account)],
)
def transfer(
    account_id: int,
    body: TransferRequest,
    service: AccountService = Depends(get_account_service),
    current: User = Depends(get_current_user),
):
    from_account, to_account = service.transfer(
        account_id, body.toAccountId, body.amount, current
    )
    return TransferResponse(
        fromAccount=_to_account_response(from_account, service),
        toAccount=_to_account_response(to_account, service),
    )


@router.get(
    "/{account_id}/transactions",
    response_model=list[TransactionResponse],
    dependencies=[Depends(get_accessible_account)],
)
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
