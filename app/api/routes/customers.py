from typing import List

from fastapi import APIRouter, Depends

from app.api.deps import get_customer_service
from app.schemas.customer import CreateCustomerRequest, CustomerResponse, UpdateCustomerRequest
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/api/customers", tags=["customers"])


def _to_customer_response(user) -> CustomerResponse:
    return CustomerResponse(userId=user.user_id, name=user.name, email=user.email)


@router.get("", response_model=List[CustomerResponse])
def list_customers(service: CustomerService = Depends(get_customer_service)):
    return [_to_customer_response(u) for u in service.list_customers()]


@router.get("/{user_id}", response_model=CustomerResponse)
def get_customer(
    user_id: int,
    service: CustomerService = Depends(get_customer_service),
):
    return _to_customer_response(service.get_customer(user_id))


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
