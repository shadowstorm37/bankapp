from dataclasses import dataclass, field
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional


@dataclass
class User:
    user_id: int
    name: str
    email: str
    # only set for customers who registered with a login; never sent to the client
    username: Optional[str] = None
    password_hash: Optional[str] = None
    role: str = "customer"  # "customer" | "admin"
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


@dataclass
class AuditEntry:
    audit_id: int
    action: str  # "DEPOSIT" | "WITHDRAW" | "TRANSFER"
    user_id: int
    user_name: str  # snapshot, so the entry stays readable if the customer changes
    from_account_id: Optional[int]
    to_account_id: Optional[int]
    amount: Decimal
    transaction_ids: List[int] = field(default_factory=list)
    # who actually made the change (may be an admin acting on a customer's
    # account); None on entries recorded before this was tracked
    performed_by_id: Optional[int] = None
    performed_by_name: Optional[str] = None  # snapshot, like user_name
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
