from typing import List

from app.core.exceptions import CustomerHasAccountsError, NotFoundError
from app.models.entities import User
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
        self.get_customer(user_id)

        existing_accounts = self.account_repo.find_by_user_id(user_id)
        if existing_accounts:
            raise CustomerHasAccountsError(
                f"Customer {user_id} has {len(existing_accounts)} account(s); "
                "cannot delete"
            )

        self.user_repo.delete(user_id)
