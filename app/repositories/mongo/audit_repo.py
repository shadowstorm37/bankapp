from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional

from bson.decimal128 import Decimal128

from app.models.entities import AuditEntry
from app.repositories.base import AuditRepository
from app.repositories.mongo import db


def _to_audit_entry(doc: dict) -> AuditEntry:
    return AuditEntry(
        audit_id=doc["_id"],
        action=doc["action"],
        user_id=doc["user_id"],
        user_name=doc["user_name"],
        from_account_id=doc.get("from_account_id"),
        to_account_id=doc.get("to_account_id"),
        amount=doc["amount"].to_decimal(),
        transaction_ids=doc["transaction_ids"],
        # older entries don't have these fields
        performed_by_id=doc.get("performed_by_id"),
        performed_by_name=doc.get("performed_by_name"),
        created_at=doc["created_at"],
    )


class MongoAuditRepository(AuditRepository):
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
            audit_id=db.get_next_id("audit_id"),
            action=action,
            user_id=user_id,
            user_name=user_name,
            from_account_id=from_account_id,
            to_account_id=to_account_id,
            amount=amount,
            transaction_ids=list(transaction_ids),
            performed_by_id=performed_by_id,
            performed_by_name=performed_by_name,
            created_at=datetime.now(timezone.utc),
        )
        db.audit.insert_one(
            {
                "_id": entry.audit_id,
                "action": entry.action,
                "user_id": entry.user_id,
                "user_name": entry.user_name,
                "from_account_id": entry.from_account_id,
                "to_account_id": entry.to_account_id,
                "amount": Decimal128(entry.amount),
                "transaction_ids": entry.transaction_ids,
                "performed_by_id": entry.performed_by_id,
                "performed_by_name": entry.performed_by_name,
                "created_at": entry.created_at,
            }
        )
        return entry

    def find_by_id(self, audit_id: int) -> Optional[AuditEntry]:
        doc = db.audit.find_one({"_id": audit_id})
        return _to_audit_entry(doc) if doc else None

    def find_all(self) -> List[AuditEntry]:
        return [_to_audit_entry(doc) for doc in db.audit.find().sort("_id", 1)]

    def find_by_account_id(self, account_id: int) -> List[AuditEntry]:
        docs = db.audit.find(
            {"$or": [{"from_account_id": account_id}, {"to_account_id": account_id}]}
        ).sort("_id", 1)
        return [_to_audit_entry(doc) for doc in docs]

    def find_by_user_id(self, user_id: int) -> List[AuditEntry]:
        docs = db.audit.find({"user_id": user_id}).sort("_id", 1)
        return [_to_audit_entry(doc) for doc in docs]

    def find_by_transaction_id(self, txn_id: int) -> Optional[AuditEntry]:
        # matching a scalar against an array field checks membership
        doc = db.audit.find_one({"transaction_ids": txn_id})
        return _to_audit_entry(doc) if doc else None
