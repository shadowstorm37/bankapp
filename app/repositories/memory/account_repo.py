from decimal import Decimal
from typing import Optional

from app.models.entities import Account
from app.repositories.base import AccountRepository
from app.repositories.memory import store


class InMemoryAccountRepository(AccountRepository):
    def create(self, user_id: int, account_type: str) -> Account:
        account = Account(
            account_id=store.next_account_id,
            user_id=user_id,
            account_type=account_type,
            balance=Decimal("0"),
        )
        store.accounts[account.account_id] = account
        store.next_account_id += 1
        return account

    def find_by_id(self, account_id: int) -> Optional[Account]:
        return store.accounts.get(account_id)

    def save(self, account: Account) -> Account:
        store.accounts[account.account_id] = account
        return account
