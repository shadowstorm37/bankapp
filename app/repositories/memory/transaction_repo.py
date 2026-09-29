from decimal import Decimal
from typing import List

from app.models.entities import Transaction
from app.repositories.base import TransactionRepository
from app.repositories.memory import store


class InMemoryTransactionRepository(TransactionRepository):
    def create(self, account_id: int, txn_type: str, amount: Decimal) -> Transaction:
        txn = Transaction(
            txn_id=store.next_txn_id,
            account_id=account_id,
            txn_type=txn_type,
            amount=amount,
        )
        store.transactions[txn.txn_id] = txn
        store.next_txn_id += 1
        return txn

    def find_by_account_id(self, account_id: int) -> List[Transaction]:
        return [
            t for t in store.transactions.values() if t.account_id == account_id
        ]
