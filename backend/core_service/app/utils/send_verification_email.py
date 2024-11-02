import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pydantic import EmailStr
from config import get_settings
import secrets
from datetime import datetime, timedelta

settings = get_settings()

# Function to generate a verification code
def generate_verification_code():
    return secrets.token_hex(4)  # Generates an 8-character hex code

# Example: Generate and store the code with an expiration time (e.g., 10 minutes)
verification_code = generate_verification_code()
expiration_time = datetime.now() + timedelta(minutes=10)

async def send_verification_email(subject: str, recipients: list[str], code: str, html: bool = True):
    # Create the content of the email
    print(f"Sending verification email to {recipients} with code: {code}")
    if html:
        
        body_content = f"<p>Your verification code is: <strong>{code}</strong></p>"
    else:
        body_content = f"Your verification code is: {code}"

    # Loop through recipients to send individually
    for recipient in recipients:
        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
        msg['To'] = recipient
        msg['Subject'] = subject
        msg.attach(MIMEText(body_content, 'html' if html else 'plain'))

        # Send email with Gmail SMTP server
        try:
            with smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
                server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
                server.sendmail(settings.MAIL_FROM, recipient, msg.as_string())
            print(f"Verification email sent successfully to {recipient}.")
        except Exception as e:
            print(f"Failed to send email to {recipient}: {e}")

# Example usage
# await send_verification_email("Your Subject Here", ["recipient@example.com"], verification_code)
