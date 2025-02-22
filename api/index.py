import requests
import re
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from api.integrationController.index import Dict, Payload, TargetRequest, TelexNewsletterRequest, getIntegration, makeResponse

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://telex.im",
        "https://staging.telex.im",
        "http://telextest.im",
        "http://staging.telextest.im"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}


@app.get("/api/py/integration.json", response_class=JSONResponse)
def home(req: Request):
    # Get base URL
    base_url = str(req.base_url)
    return getIntegration(base_url)

def extractObject(setting):
    return setting.label == "webhook-slug"

@app.post("/api/py/generate")
async def generate(request: TargetRequest, req: Request):
    try:
        # Get base URL
        base_url = str(req.base_url)
        # Extract `message` and `settings` from the request body
        print(request)
        message = request.message

        if not "/embed-form" in message:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST, content={
                    "event_name": "Invalid Command",
                    "message":    "type '/embed-form' to get the unique url for your html forms",
                    "status":     "success",
                    "username":   "Embed Form Bot",
                }
            )
        
        settings = request.settings
        

        # Find the slug by filtering the settings list
        channel_id = next((setting.get("default") for setting in settings if setting.get("label") == "channel_id"), None)
        form_name = next((setting.get("default") for setting in settings if setting.get("label") == "form_name"), None)
        logo_url = next((setting.get("default") for setting in settings if setting.get("label") == "logo_url"), None)

        # Validate required fields
        if not channel_id or not form_name or not logo_url:
            missing_field = "channel_id" if not channel_id else "form_name" if not form_name else "logo_url"
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "event_name": "Missing data",
                    "message": f"{missing_field} not found",
                    "status": "error",
                    "username": "Embed Form Bot",
                }
            )
        
        url = f"{base_url}form/{channel_id}?form_name={form_name}&logo_url={logo_url}"
        iframe = f"<iframe src='{url}' style='border-radius: 12px;border: 0;height: 650px;' title='Telex Newsletter Form'></iframe>"

        formatted_message = (
            f"Here's your embed form details:\n\n"
            f"Channel ID: {channel_id}\n"
            f"Form URL: {url}\n\n"
            f"Embed Code:\n{iframe}"
        )

        payload = Payload(
            event_name="Form URL Generated",
            message=formatted_message,
            status="success",
            username="Embed Form Bot"
        )

        response = makeResponse(payload, channel_id)
        dict = Dict(**response)

        if 200 <= dict.status_code < 300:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=payload.model_dump()
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_424_FAILED_DEPENDENCY, content=response
            )
    
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "event_name": "Error",
                "message": f"Failed to generate form URL: {str(e)}",
                "status": "error",
                "username": "Embed Form Bot"
            }
        )
    


@app.post("/api/py/telex-newsletter/{channel_id}")
async def telex_newsletter(request: TelexNewsletterRequest, channel_id: str):
    print(request.model_dump_json())
    url = f"https://ping.telex.im/v1/webhooks/{channel_id}"

    payload = {
        "event_name": "Newsletter Form",
        "message": request.model_dump_json(),
        "status": "success",
        "username": "ojutalayomi"
    }

    response = makeResponse(payload, channel_id)

    dict = Dict(**response)

    if 200 <= dict.status_code < 300:
        return response
    else:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=response
        )