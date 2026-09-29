from functools import lru_cache

from app.repositories.memory.account_repo import InMemoryAccountRepository
from app.repositories.memory.transaction_repo import InMemoryTransactionRepository
from app.repositories.memory.user_repo import InMemoryUserRepository
from app.services.account_service import AccountService

# Single shared in-memory repos so data persists across requests within one process.
_user_repo = InMemoryUserRepository()
_account_repo = InMemoryAccountRepository()
_transaction_repo = InMemoryTransactionRepository()


@lru_cache
def get_account_service() -> AccountService:
    return AccountService(_user_repo, _account_repo, _transaction_repo)
