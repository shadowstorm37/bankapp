from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from bson.decimal128 import Decimal128

from app.models.entities import Account
from app.repositories.base import AccountRepository
from app.repositories.mongo import db


def _to_account(doc: dict) -> Account:
    return Account(
        account_id=doc["_id"],
        user_id=doc["user_id"],
        account_type=doc["account_type"],
        balance=doc["balance"].to_decimal(),
        created_at=doc["created_at"],
    )


class MongoAccountRepository(AccountRepository):
    def create(self, user_id: int, account_type: str) -> Account:
        account = Account(
            account_id=db.get_next_id("account_id"),
            user_id=user_id,
            account_type=account_type,
            balance=Decimal("0"),
            created_at=datetime.now(timezone.utc),
        )
        db.accounts.insert_one(
            {
                "_id": account.account_id,
                "user_id": account.user_id,
                "account_type": account.account_type,
                "balance": Decimal128(account.balance),
                "created_at": account.created_at,
            }
        )
        return account

    def find_by_id(self, account_id: int) -> Optional[Account]:
        doc = db.accounts.find_one({"_id": account_id})
        if doc is None:
            return None
        return _to_account(doc)

    def save(self, account: Account) -> Account:
        db.accounts.replace_one(
            {"_id": account.account_id},
            {
                "_id": account.account_id,
                "user_id": account.user_id,
                "account_type": account.account_type,
                "balance": Decimal128(account.balance),
                "created_at": account.created_at,
            },
        )
        return account
