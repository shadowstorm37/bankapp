from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_customer_service
from app.schemas.account import AccountResponse
from app.schemas.customer import CreateCustomerRequest, CustomerResponse, UpdateCustomerRequest
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/api/customers", tags=["customers"])


def _to_customer_response(user) -> CustomerResponse:
    return CustomerResponse(userId=user.user_id, name=user.name, email=user.email)


@router.get("", response_model=List[CustomerResponse])
def list_customers(service: CustomerService = Depends(get_customer_service)):
    return [_to_customer_response(u) for u in service.list_customers()]


# /search and /premium must be registered before /{user_id}, or FastAPI parses
# "search"/"premium" as a user_id
@router.get("/search", response_model=List[CustomerResponse])
def search_customers(
    firstName: str = Query(min_length=1),
    service: CustomerService = Depends(get_customer_service),
):
    return [_to_customer_response(u) for u in service.find_by_first_name(firstName)]


@router.get("/premium", response_model=List[CustomerResponse])
def get_premium_customers(
    threshold: Decimal = Query(ge=0),
    service: CustomerService = Depends(get_customer_service),
):
    return [
        _to_customer_response(u) for u in service.get_premium_customers(threshold)
    ]


@router.get("/{user_id}", response_model=CustomerResponse)
def get_customer(
    user_id: int,
    service: CustomerService = Depends(get_customer_service),
):
    return _to_customer_response(service.get_customer(user_id))


@router.get("/{user_id}/accounts", response_model=List[AccountResponse])
def get_customer_accounts(
    user_id: int,
    service: CustomerService = Depends(get_customer_service),
):
    user, accounts = service.get_customer_accounts(user_id)
    return [
        AccountResponse(
            accountId=a.account_id,
            userName=user.name,
            accountType=a.account_type,
            balance=a.balance,
        )
        for a in accounts
    ]


@router.post("", response_model=CustomerResponse, status_code=201)
def create_customer(
    body: CreateCustomerRequest,
    service: CustomerService = Depends(get_customer_service),
):
    user = service.create_customer(body.name, body.email)
    return _to_customer_response(user)


@router.put("/{user_id}", response_model=CustomerResponse)
def update_customer(
    user_id: int,
    body: UpdateCustomerRequest,
    service: CustomerService = Depends(get_customer_service),
):
    user = service.update_customer(user_id, body.name, body.email)
    return _to_customer_response(user)


@router.delete("/{user_id}", status_code=204)
def delete_customer(
    user_id: int,
    service: CustomerService = Depends(get_customer_service),
):
    service.delete_customer(user_id)
