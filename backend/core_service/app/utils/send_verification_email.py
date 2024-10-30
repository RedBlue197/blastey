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

async def send_verification_email(subject: str, recipients: list[EmailStr], code: str, html: bool = True):
    # Create a multipart message
    message = MIMEMultipart()
    message["From"] = settings.MAIL_FROM
    message["Subject"] = subject

    # Create the body of the email
    if html:
        body = f"<p>Your verification code is: <strong>{code}</strong></p>"
        message.attach(MIMEText(body, "html"))
    else:
        body = f"Your verification code is: {code}"
        message.attach(MIMEText(body, "plain"))

    # Connect to the SMTP server and send the email
    try:
        with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
            server.starttls()  # Start TLS for security
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            for recipient in recipients:
                message["To"] = recipient
                server.sendmail(settings.MAIL_FROM, recipient, message.as_string())
            print("Verification email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Example usage
# await send_verification_email("Your Subject Here", ["recipient@example.com"], verification_code)
