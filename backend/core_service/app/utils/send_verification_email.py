from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, Content
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

async def send_verification_email(subject: str, recipients: list[EmailStr], code: str, html: bool = True):
    # Create the content of the email
    if html:
        body_content = f"<p>Your verification code is: <strong>{code}</strong></p>"
    else:
        body_content = f"Your verification code is: {code}"

    # Loop through recipients to send individually
    for recipient in recipients:
        message = Mail(
            from_email=(settings.MAIL_FROM, settings.MAIL_FROM_NAME),
            to_emails=recipient,
            subject=subject,
            html_content=Content("text/html", body_content) if html else Content("text/plain", body_content)
        )

        # Send email with SendGrid client
        try:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)  # Use your SendGrid API key
            response = sg.send(message)
            if response.status_code == 202:
                print(f"Verification email sent successfully to {recipient}.")
            else:
                print(f"Failed to send email to {recipient}. Status Code: {response.status_code}")
        except Exception as e:
            print(f"Failed to send email to {recipient}: {e}")

# Example usage
# await send_verification_email("Your Subject Here", ["recipient@example.com"], verification_code)
