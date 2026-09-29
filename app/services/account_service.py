from decimal import Decimal

from app.core.exceptions import InsufficientFundsError, NotFoundError, ValidationError
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
