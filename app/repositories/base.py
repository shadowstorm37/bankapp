from abc import ABC, abstractmethod
from typing import List, Optional

from app.models.entities import Account, Transaction, User


class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]:
        ...

    @abstractmethod
    def find_all(self) -> List[User]:
        ...

    @abstractmethod
    def create(self, name: str, email: str) -> User:
        ...

    @abstractmethod
    def update(self, user_id: int, name: str, email: str) -> Optional[User]:
        ...

    @abstractmethod
    def delete(self, user_id: int) -> bool:
        ...


class AccountRepository(ABC):
    @abstractmethod
    def create(self, user_id: int, account_type: str) -> Account:
        ...

    @abstractmethod
    def find_by_id(self, account_id: int) -> Optional[Account]:
        ...

    @abstractmethod
    def find_by_user_id(self, user_id: int) -> List[Account]:
        ...

    @abstractmethod
    def save(self, account: Account) -> Account:
        ...


class TransactionRepository(ABC):
    @abstractmethod
    def create(self, account_id: int, txn_type: str, amount) -> Transaction:
        ...

    @abstractmethod
    def find_by_account_id(self, account_id: int) -> List[Transaction]:
        ...
