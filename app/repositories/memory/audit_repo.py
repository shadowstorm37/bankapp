from decimal import Decimal
from typing import List, Optional

from app.models.entities import AuditEntry
from app.repositories.base import AuditRepository
from app.repositories.memory import store


class InMemoryAuditRepository(AuditRepository):
    def create(
        self,
        action: str,
        user_id: int,
        user_name: str,
        from_account_id: Optional[int],
        to_account_id: Optional[int],
        amount: Decimal,
        transaction_ids: List[int],
        performed_by_id: int,
        performed_by_name: str,
    ) -> AuditEntry:
        entry = AuditEntry(
            audit_id=store.next_audit_id,
            action=action,
            user_id=user_id,
            user_name=user_name,
            from_account_id=from_account_id,
            to_account_id=to_account_id,
            amount=amount,
            # copy so later changes to the caller's list can't rewrite history
            transaction_ids=list(transaction_ids),
            performed_by_id=performed_by_id,
            performed_by_name=performed_by_name,
        )
        store.audit_entries[entry.audit_id] = entry
        store.next_audit_id += 1
        return entry

    def find_by_id(self, audit_id: int) -> Optional[AuditEntry]:
        return store.audit_entries.get(audit_id)

    def find_all(self) -> List[AuditEntry]:
        return list(store.audit_entries.values())

    def find_by_account_id(self, account_id: int) -> List[AuditEntry]:
        return [
            e
            for e in store.audit_entries.values()
            if account_id in (e.from_account_id, e.to_account_id)
        ]

    def find_by_user_id(self, user_id: int) -> List[AuditEntry]:
        return [e for e in store.audit_entries.values() if e.user_id == user_id]

    def find_by_transaction_id(self, txn_id: int) -> Optional[AuditEntry]:
        return next(
            (e for e in store.audit_entries.values() if txn_id in e.transaction_ids),
            None,
        )
