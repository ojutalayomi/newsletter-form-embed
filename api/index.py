import requests
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

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

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}


@app.get("/api/py/home", response_class=HTMLResponse)
def home():
    return "<iframe src='http://localhost:3000/' style='border-radius: 12px;border: 0;height: 650px;' title='Telex Newsletter Form'></iframe>"

def extractObject(setting):
    return setting.label == "webhook-slug"

@app.post("/api/py/generate")
async def generate(request: TargetRequest):
    # Extract `message` and `settings` from the request body
    print(request)
    message = request.get("message")
    settings = request.get("settings", [])

    # Find the slug by filtering the settings list
    slug = next((setting.get("default") for setting in settings if setting.get("label") == "webhook-slug"), None)
    print("\n"+slug)

    if not slug:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Slug not found"}
        )
    

url = "https://ping.telex.im/v1/webhooks/01951ee7-d706-7239-9d78-a035cfc2e381"

@app.post("/api/py/telex-newsletter")
async def telex(request: TelexNewsletterRequest):
    print(request.model_dump_json())

    payload = {
        "event_name": "Newsletter Form",
        "message": request.model_dump_json(),
        "status": "success",
        "username": "ojutalayomi"
    }

    response = requests.post(
        url,
        json=payload,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    )

    dict = Dict(**response.json())

    if dict.status_code == 200:
        return response.json()
    else:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=response.json()
        )