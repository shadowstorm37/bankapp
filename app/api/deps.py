from functools import lru_cache

from app.repositories.mongo.account_repo import MongoAccountRepository
from app.repositories.mongo.transaction_repo import MongoTransactionRepository
from app.repositories.mongo.user_repo import MongoUserRepository
from app.services.account_service import AccountService
from app.services.customer_service import CustomerService

_user_repo = MongoUserRepository()
_account_repo = MongoAccountRepository()
_transaction_repo = MongoTransactionRepository()


@lru_cache
def get_account_service() -> AccountService:
    return AccountService(_user_repo, _account_repo, _transaction_repo)


@lru_cache
def get_customer_service() -> CustomerService:
    return CustomerService(_user_repo, _account_repo)
