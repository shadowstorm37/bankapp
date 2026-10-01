from functools import lru_cache

from app.repositories.mongo.account_repo import MongoAccountRepository
from app.repositories.mongo.audit_repo import MongoAuditRepository
from app.repositories.mongo.transaction_repo import MongoTransactionRepository
from app.repositories.mongo.user_repo import MongoUserRepository
from app.services.account_service import AccountService
from app.services.audit_service import AuditService
from app.services.customer_service import CustomerService

_user_repo = MongoUserRepository()
_account_repo = MongoAccountRepository()
_transaction_repo = MongoTransactionRepository()
_audit_repo = MongoAuditRepository()
_audit_service = AuditService(_audit_repo, _user_repo)


@lru_cache
def get_account_service() -> AccountService:
    return AccountService(_user_repo, _account_repo, _transaction_repo, _audit_service)


@lru_cache
def get_customer_service() -> CustomerService:
    return CustomerService(_user_repo, _account_repo)


def get_audit_service() -> AuditService:
    return _audit_service
