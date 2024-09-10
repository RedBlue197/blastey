from fastapi import status, APIRouter, Query
from dependencies.db_dependency import db_dependency
from models.address_model import Address

from schemas.address_schema import CreateAddressRequest

import uuid

from utils.responses import success_response

router = APIRouter(
    prefix="/core/frontoffice/v1/addresses",
    tags=['Frontoffice Addresses']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------
@router.get("/address-by-user-id/{user_id}", status_code=status.HTTP_200_OK)
async def get_address_by_user_id(
    db: db_dependency, 
    user_id: uuid.UUID,
    page: int = Query(1, ge=1),  # Default to page 1, must be greater than or equal to 1
    items_per_page: int = Query(10, le=100)  # Default to 10 items per page, max 100
):
    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query the database with pagination
    total_count = db.query(Address).filter(
        Address.user_id==user_id,
        Address.is_deleted == False
    ).count()
    addresses = db.query(Address).offset(offset).limit(limit).filter(
        Address.user_id==user_id,
        Address.is_deleted == False,
    ).all()

    total_pages = (total_count + items_per_page - 1) // items_per_page

    if len(addresses) == 0:
        return success_response(
            message="No addresses found",
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )
    else:
        return success_response(
            data=addresses,
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )


#----------------------------------------------------POST ENDPOINTS----------------------------------------------------
@router.post("/create-address", status_code=status.HTTP_201_CREATED)
async def create_address(
    db: db_dependency, 
    address: CreateAddressRequest
):
    # Check if the address already exists
    address = db.query(Address).filter(Address.user_id==address.user_id).first()
    if address:
        return success_response(
            message="Address already exists",
            data=address
        )
    
    create_address_model = Address(
        user_id=address.user_id,
        address_name=address.address_name,
        address_city=address.address_city,
        address_country=address.address_country,
        address_postal_code=address.address_postal_code,
        address_is_primary=True,
        address_is_active=True,
        address_latitude=address.address_latitude,
        address_longitude=address.address_longitude,
        created_by=address.user_id
        
    )
    db.add(create_address_model)
    db.commit()
    db.refresh(create_address_model)
    db.close()
    return success_response(data=create_address_model, message="Address created successfully")

