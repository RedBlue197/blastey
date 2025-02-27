# app/routers/user_router.py

from fastapi import status, APIRouter

from dependencies.db_dependency import db_dependency



from interfaces.anonymous.newsletter_interface import NewsletterInterface

from schemas.anonymous.newsletter_schema import (
    CreateNewsletterEmailRequest,
    )

from utils.responses import api_response

from utils.send_verification_email import send_verification_email


router = APIRouter(
    prefix="/core/frontoffice/v1/newsletters",
    tags=['Frontoffice Newsletters']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

    
#----------------------------------------------------POST ENDPOINTS----------------------------------------------------


#API to create newsletter email
@router.post("/create-newsletter-email", status_code=status.HTTP_201_CREATED)
async def create_newsletter_email(
    newsletter_data: CreateNewsletterEmailRequest,
    db: db_dependency
    ):

    try:
        is_created = NewsletterInterface(db).create_newsletter_email(newsletter_data)

        if is_created:
            return api_response(
                message="Newsletter email created successfully",
                status_code=201
            )
        else:
            return api_response(
                message="Newsletter email creation failed",
                status_code=500
            )

    except Exception as e:
        return api_response(
            message="Newsletter email creation failed: " + str(e),
            status_code=500
        )

#----------------------------------------------------PUT ENDPOINTS----------------------------------------------------
