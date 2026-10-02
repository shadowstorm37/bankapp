from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class CreateAccountRequest(BaseModel):
    userId: int
    accountType: str


class AmountRequest(BaseModel):
    amount: Decimal = Field(gt=0)


class UpdateAccountRequest(BaseModel):
    accountType: str


class TransferRequest(BaseModel):
    toAccountId: int
    amount: Decimal = Field(gt=0)


class AccountResponse(BaseModel):
    accountId: int
    userId: int
    userName: str
    accountType: str
    balance: Decimal

    class Config:
        json_encoders = {Decimal: lambda v: float(v)}


class TransferDestinationResponse(AccountResponse):
    # None unless the caller owns the destination account or is an admin
    balance: Optional[Decimal] = None


class TransferResponse(BaseModel):
    fromAccount: AccountResponse
    toAccount: TransferDestinationResponse


class TransactionResponse(BaseModel):
    txnId: int
    type: str
    amount: Decimal
    date: datetime

    class Config:
        json_encoders = {Decimal: lambda v: float(v)}
