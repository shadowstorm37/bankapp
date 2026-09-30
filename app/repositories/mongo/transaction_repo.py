from datetime import datetime, timezone
from decimal import Decimal
from typing import List

from bson.decimal128 import Decimal128

from app.models.entities import Transaction
from app.repositories.base import TransactionRepository
from app.repositories.mongo import db


def _to_transaction(doc: dict) -> Transaction:
    return Transaction(
        txn_id=doc["_id"],
        account_id=doc["account_id"],
        txn_type=doc["txn_type"],
        amount=doc["amount"].to_decimal(),
        created_at=doc["created_at"],
    )


class MongoTransactionRepository(TransactionRepository):
    def create(self, account_id: int, txn_type: str, amount: Decimal) -> Transaction:
        txn = Transaction(
            txn_id=db.get_next_id("txn_id"),
            account_id=account_id,
            txn_type=txn_type,
            amount=amount,
            created_at=datetime.now(timezone.utc),
        )
        db.transactions.insert_one(
            {
                "_id": txn.txn_id,
                "account_id": txn.account_id,
                "txn_type": txn.txn_type,
                "amount": Decimal128(txn.amount),
                "created_at": txn.created_at,
            }
        )
        return txn

    def find_by_account_id(self, account_id: int) -> List[Transaction]:
        docs = db.transactions.find({"account_id": account_id})
        return [_to_transaction(doc) for doc in docs]
