from pydantic import BaseModel, Field,EmailStr

#----------------------------------------------------------CREATE SCHEMAS-----------------------------------------------------------------------------

class CreateNewsletterEmailRequest(BaseModel):
    newsletter_email: EmailStr = Field(..., pattern=r'^\S+@\S+\.\S+$', description="Email of the user")