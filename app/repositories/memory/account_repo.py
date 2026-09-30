from decimal import Decimal
from typing import List, Optional

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

    def find_by_user_id(self, user_id: int) -> List[Account]:
        return [a for a in store.accounts.values() if a.user_id == user_id]

    def find_all(self) -> List[Account]:
        return list(store.accounts.values())

    def update(self, account_id: int, account_type: str) -> Optional[Account]:
        account = store.accounts.get(account_id)
        if account is None:
            return None
        account.account_type = account_type
        return account

    def delete(self, account_id: int) -> bool:
        if account_id in store.accounts:
            del store.accounts[account_id]
            return True
        return False

    def find_premium(self, threshold: Decimal) -> List[Account]:
        return [a for a in store.accounts.values() if a.balance >= threshold]

    def save(self, account: Account) -> Account:
        store.accounts[account.account_id] = account
        return account
