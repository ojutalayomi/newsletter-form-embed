import time

from pydantic import BaseModel
import requests
from typing import Union

class TelexNewsletterRequest(BaseModel):
    firstname: str
    lastname: str
    email: str
    interval: str

class Dict(BaseModel):
    message: str
    status_code: int
    status: str

class TargetRequest(BaseModel):
    message: str
    settings: list[dict]

class Payload(BaseModel):
    event_name: str
    message: str
    status: str
    username: str

def makeResponse(data: Payload) -> Union[Dict, None]:
    try:
        url = f"https://ping.telex.im/v1/webhooks/{data.channel_id}"

        payload = {
            "event_name": data.event_name,
            "message": data.message,
            "status": data.status,
            "username": data.username
        }

        response = requests.post(
            url,
            json=payload,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        return None

def getIntegration(url):
    current_date = time.strftime("%Y-%m-%d")
    return {
        "data": {
            "date": {
                "created_at": "2025-02-19",
                "updated_at": f"{current_date}"
            },
            "descriptions": {
                "app_description": "This integration allows visitors to subscribe to a newsletter by providing their contact information. Additionally, users can specify their preferences, such as how often they would like to receive newsletters and the type of content they are interested in. The app ensures a seamless subscription process and helps in maintaining an engaged audience.",
                "app_logo": "https://telex-newsletter.duckdns.org/emb.svg",
                "app_name": "Newsletter Form",
                "app_url": f"{url}",
                "background_color": "#864def"
            },
            "integration_category": "Task Automation",
            "integration_type": "output",
            "is_active": True,
            "key_features": [
                "Customizable subscription form",
                "Option to specify preferences",
                "Automated subscription process",
                "User-friendly interface"
            ],
            "permissions": {
                "monitoring_user": {
                    "always_online": True,
                    "display_name": "Performance Monitor"
                }
            },
            "settings": [
                {
                "label": "form_name",
                "type": "text",
                "required": True,
                "default": ""
                },
                {
                "label": "logo_url",
                "type": "text",
                "required": True,
                "default": ""
                },
                {
                "label": "email",
                "type": "text",
                "required": True,
                "default": ""
                },
                {
                "label": "channel_id",
                "type": "text",
                "required": True,
                "default": ""
                }
            ],
            "tick_url": f"{url}/api/integration",
            "target_url": f"{url}/api/py/generate"
        }
    }
