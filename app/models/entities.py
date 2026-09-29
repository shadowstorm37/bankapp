from dataclasses import dataclass, field
from datetime import datetime, timezone
from decimal import Decimal


@dataclass
class User:
    user_id: int
    name: str
    email: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class Account:
    account_id: int
    user_id: int
    account_type: str
    balance: Decimal = Decimal("0")
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class Transaction:
    txn_id: int
    account_id: int
    txn_type: str  # "DEPOSIT" | "WITHDRAW"
    amount: Decimal
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
