from typing import List, Optional

from fastapi import APIRouter, Depends

from app.api.deps import get_audit_service, require_admin
from app.schemas.audit import AuditEntryResponse
from app.services.audit_service import AuditService

# the whole audit trail is admin-only
router = APIRouter(
    prefix="/api/audit", tags=["audit"], dependencies=[Depends(require_admin)]
)


def _to_audit_response(entry) -> AuditEntryResponse:
    return AuditEntryResponse(
        auditId=entry.audit_id,
        action=entry.action,
        userId=entry.user_id,
        userName=entry.user_name,
        fromAccountId=entry.from_account_id,
        toAccountId=entry.to_account_id,
        amount=entry.amount,
        transactionIds=entry.transaction_ids,
        date=entry.created_at,
    )


@router.get("", response_model=List[AuditEntryResponse])
def list_audit_entries(
    accountId: Optional[int] = None,
    userId: Optional[int] = None,
    service: AuditService = Depends(get_audit_service),
):
    return [_to_audit_response(e) for e in service.list_entries(accountId, userId)]


@router.get("/transactions/{txn_id}", response_model=AuditEntryResponse)
def trace_transaction(
    txn_id: int,
    service: AuditService = Depends(get_audit_service),
):
    return _to_audit_response(service.trace_transaction(txn_id))


@router.get("/{audit_id}", response_model=AuditEntryResponse)
def get_audit_entry(
    audit_id: int,
    service: AuditService = Depends(get_audit_service),
):
    return _to_audit_response(service.get_entry(audit_id))
