from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from config import get_settings
settings = get_settings()


# Set up ConnectionConfig for FastMail
mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_SETTINGS.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_SETTINGS.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_SETTINGS.MAIL_FROM,
    MAIL_PORT=settings.MAIL_SETTINGS.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SETTINGS.MAIL_SERVER,
    MAIL_STARTTLS =settings.MAIL_SETTINGS.MAIL_STARTTLS ,
    MAIL_SSL_TLS=settings.MAIL_SETTINGS.MAIL_SSL_TLS,
    MAIL_FROM_NAME=settings.MAIL_SETTINGS.MAIL_FROM_NAME
)

import secrets
from datetime import datetime, timedelta

def generate_verification_code():
    return secrets.token_hex(4)  # Generates an 8-character hex code

# Example: Generate and store the code with an expiration time (e.g., 10 minutes)
verification_code = generate_verification_code()
expiration_time = datetime.now() + timedelta(minutes=10)


async def send_verification_email(subject: str, recipients: list[EmailStr], body: str,code:str, html: bool = True):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=f"Your verification code is: {code}",
        subtype="html" if html else "plain"
    )

    fm = FastMail(mail_config)
    await fm.send_message(message)