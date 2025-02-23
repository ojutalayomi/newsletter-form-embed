import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
email_user = os.getenv("EMAIL_USER")
email_password = os.getenv("EMAIL_PASSWORD")


# Send the email
def send_email(receiver_email: str, body: str, receiver_name: str):
    subject = "Newsletter Form Details"
    # Create the email
    message = MIMEMultipart()
    message["From"] = "Telex Newsletter Form"
    message["To"] = receiver_name
    message["Subject"] = subject

    # Attach the body to the email
    message.attach(MIMEText(body, "html"))
    try:
        # Connect to the SMTP server
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(email_user, email_password)  # Log in to the SMTP server
            server.sendmail(email_user, receiver_email, message.as_string())  # Send the email
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")