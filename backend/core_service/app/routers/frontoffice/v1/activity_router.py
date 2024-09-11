from fastapi import status, APIRouter, Query, HTTPException, Request
from dependencies.db_dependency import db_dependency
from models.activity_model import Activity, ActivityItem
from schemas.activity_schema import CreateActivityRequest
from utils.responses import success_response
from utils.extract_user import extract_user_id

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/activities",
    tags=['Frontoffice Activities']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

@router.get("/", status_code=status.HTTP_200_OK)
async def get_activities(
    db: db_dependency,
    page: int = Query(1, ge=1),  # Default to page 1, must be greater than or equal to 1
    items_per_page: int = Query(10, le=100)  # Default to 10 items per page, max 100
):
    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query the database with pagination
    total_count = db.query(Activity).filter(
        Activity.is_deleted == False,
        Activity.status == True,
    ).count()
    activities = db.query(Activity).filter(
        Activity.is_deleted == False,
        Activity.status == True,
    ).offset(offset).limit(limit).all()

    total_pages = (total_count + items_per_page - 1) // items_per_page

    if len(activities) == 0:
        return success_response(
            message="No activities found",
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page,
            cacheable=True
        )
    else:
        return success_response(
            data=activities,
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page,
            cacheable=True
        )

@router.get("/activity-by-id/{activity_id}", status_code=status.HTTP_200_OK)
async def get_activity_by_id(
    db: db_dependency, 
    activity_id: uuid.UUID
):
    activity = db.query(Activity).filter(
        Activity.activity_id == activity_id,
        Activity.is_deleted==False,
    ).first()
    if activity:
        return success_response(data=activity, message="Activity found")
    else:
        return success_response(message="Activity not found")

#----------------------------------------------------POST ENDPOINTS----------------------------------------------------
@router.post("/create-activity", status_code=status.HTTP_201_CREATED)
async def create_activity(
    db: db_dependency, 
    request: Request,
    create_activity_request: CreateActivityRequest
):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = auth_header.split(" ")[1]  # Extract the token from "Bearer <token>"
    
    try:
        user_id = extract_user_id(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    create_activity_model = Activity(
        activity_title=create_activity_request.activity_title,
        activity_description=create_activity_request.activity_description,
        user_id=create_activity_request.user_id,
        address_id=create_activity_request.address_id
    )
    db.add(create_activity_model)
    db.commit()
    db.refresh(create_activity_model)
    db.close()
    activity_items = []
    for item in create_activity_request.activity_items:
        create_activity_item_model = ActivityItem(
            activity_item_name=item.activity_item_name,
            activity_id=create_activity_model.activity_id,
            activity_item_traveler_reward=item.activity_item_traveler_reward,
            created_by=user_id
        )
        db.add(create_activity_item_model)
        db.commit()
        db.refresh(create_activity_item_model)
        db.close()
        activity_items.append(create_activity_item_model)
    data={
        "activity": create_activity_model,
        "activity_items": activity_items
    }
    return success_response(data=data, message="activity created successfully")

#----------------------------------------------------PATCH ENDPOINTS----------------------------------------------------


# @router.patch("/update-activity", status_code=status.HTTP_200_OK)
# async def update_activity(
#     db: db_dependency, 
#     request: Request,
#     update_activity_request : UpdateActivityRequest
# ):
#     auth_header = request.headers.get("Authorization")
#     if not auth_header:
#         raise HTTPException(status_code=401, detail="Authorization header missing")

#     token = auth_header.split(" ")[1]  # Extract the token from "Bearer <token>"
    
#     try:
#         user_id = extract_user_id(token)
#     except ValueError as e:
#         raise HTTPException(status_code=401, detail=str(e))
#     activity = db.query(activity).filter(
#         activity.activity_id == update_activity_request.activity_id,
#         activity.is_deleted == False
#     ).first()
#     if activity:
#         update_data =  update_activity_request.dict(exclude_unset=True)
#         activity.update(update_data,synchronize_session=False)
#         activity.updated_by = user_id
#         db.commit()
#         db.refresh(activity)
#         db.close()
#         data={
#             "activity": activity,
#         }
#         return success_response(data=data, message="activity updated successfully")
#     else:
#         return success_response(message="activity not found")
    
# @router.patch("/update-activity-item", status_code=status.HTTP_200_OK)
# async def update_activity_item(
#     db: db_dependency, 
#     request: Request,
#     update_activity_item_request : UpdateactivityItemRequest
# ):
#     auth_header = request.headers.get("Authorization")
#     if not auth_header:
#         raise HTTPException(status_code=401, detail="Authorization header missing")

#     token = auth_header.split(" ")[1]  # Extract the token from "Bearer <token>"
    
#     try:
#         user_id = extract_user_id(token)
#     except ValueError as e:
#         raise HTTPException(status_code=401, detail=str(e))
#     activity_item = db.query(activityItem).filter(
#         activityItem.activity_item_id == update_activity_item_request.activity_item_id,
#         activityItem.is_deleted == False,
#         activity.activity_id == update_activity_item_request.activity_id
#     ).first()
#     if activity_item:
#         update_data =  update_activity_item_request.dict(exclude_unset=True)
#         activity_item.update(update_data,synchronize_session=False)
#         activity_item.updated_by = user_id
#         db.commit()
#         db.refresh(activity_item)
#         db.close()
#         data={
#             "activity_item": activity_item,
#         }
#         return success_response(data=data, message="activity item updated successfully")
#     else:
#         return success_response(message="activity item not found")

# #----------------------------------------------------DELETE ENDPOINTS----------------------------------------------------


# @router.delete("/delete-activity", status_code=status.HTTP_200_OK)
# async def delete_activity(
#     db: db_dependency, 
#     request: Request,
#     activity_id: uuid.UUID
# ):
#     auth_header = request.headers.get("Authorization")
#     if not auth_header:
#         raise HTTPException(status_code=401, detail="Authorization header missing")

#     token = auth_header.split(" ")[1]  # Extract the token from "Bearer <token>"
    
#     try:
#         user_id = extract_user_id(token)
#     except ValueError as e:
#         raise HTTPException(status_code=401, detail=str(e))
#     activity = db.query(activity).filter(
#         activity.activity_id == activity_id,
#         activity.is_deleted == False
#     ).first()
#     if activity:
#         activity.is_deleted = True
#         activity.deleted_by = user_id
#         db.commit()
#         db.refresh(activity)
#         db.close()
#         return success_response(message="activity deleted successfully")
#     else:
#         return success_response(message="activity not found")
    
# @router.delete("/delete-activity-item", status_code=status.HTTP_200_OK)
# async def delete_activity_item(
#     db: db_dependency, 
#     request: Request,
#     activity_item_id: uuid.UUID
# ):
#     auth_header = request.headers.get("Authorization")
#     if not auth_header:
#         raise HTTPException(status_code=401, detail="Authorization header missing")

#     token = auth_header.split(" ")[1]  # Extract the token from "Bearer <token>"
    
#     try:
#         user_id = extract_user_id(token)
#     except ValueError as e:
#         raise HTTPException(status_code=401, detail=str(e))
#     activity_item = db.query(activityItem).filter(
#         activityItem.activity_item_id == activity_item_id,
#         activityItem.is_deleted == False
#     ).first()
#     if activity_item:
#         activity_item.is_deleted = True
#         activity_item.deleted_by = user_id
#         db.commit()
#         db.refresh(activity_item)
#         db.close()
#         return success_response(message="activity item deleted successfully")
#     else:
#         return success_response(message="activity item not found")