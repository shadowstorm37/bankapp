from datetime import datetime
from decimal import Decimal

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
    userName: str
    accountType: str
    balance: Decimal

    class Config:
        json_encoders = {Decimal: lambda v: float(v)}


class TransferResponse(BaseModel):
    fromAccount: AccountResponse
    toAccount: AccountResponse


class TransactionResponse(BaseModel):
    txnId: int
    type: str
    amount: Decimal
    date: datetime

    class Config:
        json_encoders = {Decimal: lambda v: float(v)}
