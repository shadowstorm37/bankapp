from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.deps import check_database

router = APIRouter(prefix="/api/health", tags=["health"])


# public: lets the front end (or a monitor) check the API and database are up
@router.get("")
def health():
    if not check_database():
        return JSONResponse(
            status_code=503, content={"status": "error", "database": "unreachable"}
        )
    return {"status": "ok", "database": "ok"}
