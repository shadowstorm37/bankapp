from decimal import Decimal
from typing import List, Optional

from app.core.exceptions import NotFoundError
from app.models.entities import AuditEntry, User
from app.repositories.base import AuditRepository, UserRepository


class AuditService:
    def __init__(self, audit_repo: AuditRepository, user_repo: UserRepository):
        self.audit_repo = audit_repo
        self.user_repo = user_repo

    def record(
        self,
        action: str,
        user_id: int,
        from_account_id: Optional[int],
        to_account_id: Optional[int],
        amount: Decimal,
        transaction_ids: List[int],
        performed_by: User,
    ) -> AuditEntry:
        """user_id is the account owner; performed_by is whoever made the
        change (the owner themselves, or an admin)."""
        user = self.user_repo.find_by_id(user_id)
        return self.audit_repo.create(
            action,
            user_id,
            user.name if user else "",
            from_account_id,
            to_account_id,
            amount,
            transaction_ids,
            performed_by.user_id,
            performed_by.name,
        )

    def get_entry(self, audit_id: int) -> AuditEntry:
        entry = self.audit_repo.find_by_id(audit_id)
        if entry is None:
            raise NotFoundError(f"Audit entry {audit_id} not found")
        return entry

    def list_entries(
        self, account_id: Optional[int] = None, user_id: Optional[int] = None
    ) -> List[AuditEntry]:
        if account_id is not None:
            entries = self.audit_repo.find_by_account_id(account_id)
            if user_id is not None:
                entries = [e for e in entries if e.user_id == user_id]
            return entries
        if user_id is not None:
            return self.audit_repo.find_by_user_id(user_id)
        return self.audit_repo.find_all()

    def trace_transaction(self, txn_id: int) -> AuditEntry:
        entry = self.audit_repo.find_by_transaction_id(txn_id)
        if entry is None:
            raise NotFoundError(f"No audit entry for transaction {txn_id}")
        return entry
