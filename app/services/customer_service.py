from decimal import Decimal
from typing import List, Tuple

from app.core.exceptions import (
    AdminAccountProtectedError,
    CustomerHasAccountsError,
    NotFoundError,
)
from app.models.entities import Account, User
from app.repositories.base import AccountRepository, UserRepository


class CustomerService:
    def __init__(self, user_repo: UserRepository, account_repo: AccountRepository):
        self.user_repo = user_repo
        self.account_repo = account_repo

    def list_customers(self) -> List[User]:
        return self.user_repo.find_all()

    def get_customer(self, user_id: int) -> User:
        user = self.user_repo.find_by_id(user_id)
        if user is None:
            raise NotFoundError(f"Customer {user_id} not found")
        return user

    def create_customer(self, name: str, email: str) -> User:
        return self.user_repo.create(name, email)

    def update_customer(self, user_id: int, name: str, email: str) -> User:
        user = self.user_repo.update(user_id, name, email)
        if user is None:
            raise NotFoundError(f"Customer {user_id} not found")
        return user

    def delete_customer(self, user_id: int) -> None:
        user = self.get_customer(user_id)
        # deleting the admin would leave nobody able to manage the bank
        if user.role == "admin":
            raise AdminAccountProtectedError("Admin accounts can't be deleted")

        existing_accounts = self.account_repo.find_by_user_id(user_id)
        if existing_accounts:
            raise CustomerHasAccountsError(
                f"Customer {user_id} has {len(existing_accounts)} account(s); "
                "cannot delete"
            )

        self.user_repo.delete(user_id)

    def find_by_first_name(self, first_name: str) -> List[User]:
        return self.user_repo.find_by_first_name(first_name)

    def get_premium_customers(self, threshold: Decimal) -> List[User]:
        # a premium customer owns at least one account at or above the threshold
        owner_ids = sorted({a.user_id for a in self.account_repo.find_premium(threshold)})
        users = [self.user_repo.find_by_id(uid) for uid in owner_ids]
        return [u for u in users if u is not None]

    def get_customer_accounts(self, user_id: int) -> Tuple[User, List[Account]]:
        # 404 for an unknown customer, instead of an empty list
        user = self.get_customer(user_id)
        return user, self.account_repo.find_by_user_id(user_id)
