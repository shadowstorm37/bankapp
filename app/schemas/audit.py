from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


class AuditEntryResponse(BaseModel):
    auditId: int
    action: str
    userId: int
    userName: str
    fromAccountId: Optional[int]
    toAccountId: Optional[int]
    amount: Decimal
    transactionIds: List[int]
    date: datetime

    class Config:
        json_encoders = {Decimal: lambda v: float(v)}
