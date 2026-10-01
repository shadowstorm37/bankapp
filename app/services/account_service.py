from decimal import Decimal
from typing import List, Tuple

from app.core.exceptions import (
    AccountHasBalanceError,
    InsufficientFundsError,
    NotFoundError,
    ValidationError,
)
from app.models.entities import Account, Transaction
from app.repositories.base import AccountRepository, TransactionRepository, UserRepository


class AccountService:
    def __init__(
        self,
        user_repo: UserRepository,
        account_repo: AccountRepository,
        transaction_repo: TransactionRepository,
    ):
        self.user_repo = user_repo
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo

    def create_account(self, user_id: int, account_type: str) -> Account:
        if self.user_repo.find_by_id(user_id) is None:
            raise NotFoundError(f"User {user_id} not found")
        return self.account_repo.create(user_id, account_type)

    def get_account(self, account_id: int) -> Account:
        account = self.account_repo.find_by_id(account_id)
        if account is None:
            raise NotFoundError(f"Account {account_id} not found")
        return account

    def deposit(self, account_id: int, amount: Decimal) -> Account:
        if amount <= 0:
            raise ValidationError("Deposit amount must be positive")

        account = self.get_account(account_id)
        account.balance += amount
        self.account_repo.save(account)
        self.transaction_repo.create(account_id, "DEPOSIT", amount)
        return account

    def withdraw(self, account_id: int, amount: Decimal) -> Account:
        if amount <= 0:
            raise ValidationError("Withdraw amount must be positive")

        account = self.get_account(account_id)
        if amount > account.balance:
            raise InsufficientFundsError("Cannot withdraw more than balance")

        account.balance -= amount
        self.account_repo.save(account)
        self.transaction_repo.create(account_id, "WITHDRAW", amount)
        return account

    def get_transactions(self, account_id: int) -> list[Transaction]:
        # ensures 404 on unknown account instead of silently returning []
        self.get_account(account_id)
        return self.transaction_repo.find_by_account_id(account_id)

    def list_accounts(self) -> List[Account]:
        return self.account_repo.find_all()

    def update_account(self, account_id: int, account_type: str) -> Account:
        account = self.account_repo.update(account_id, account_type)
        if account is None:
            raise NotFoundError(f"Account {account_id} not found")
        return account

    def delete_account(self, account_id: int) -> None:
        account = self.get_account(account_id)
        if account.balance != 0:
            raise AccountHasBalanceError(
                f"Account {account_id} has a nonzero balance; cannot delete"
            )
        self.account_repo.delete(account_id)

    def get_premium_accounts(self, threshold: Decimal) -> List[Account]:
        return self.account_repo.find_premium(threshold)

    def transfer(
        self, from_id: int, to_id: int, amount: Decimal
    ) -> Tuple[Account, Account]:
        if from_id == to_id:
            raise ValidationError("Cannot transfer to the same account")
        if amount <= 0:
            raise ValidationError("Transfer amount must be positive")

        from_account = self.get_account(from_id)
        to_account = self.get_account(to_id)

        if amount > from_account.balance:
            raise InsufficientFundsError("Cannot transfer more than balance")

        from_account.balance -= amount
        to_account.balance += amount
        self.account_repo.save(from_account)
        self.account_repo.save(to_account)
        self.transaction_repo.create(from_id, "TRANSFER_OUT", amount)
        self.transaction_repo.create(to_id, "TRANSFER_IN", amount)
        return from_account, to_account
