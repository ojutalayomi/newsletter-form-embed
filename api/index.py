from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

class TelexNewsletterRequest(BaseModel):
    firstname: str
    lastname: str
    email: str
    interval: str

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

@app.post("/api/py/telex-newsletter")
async def telex(request: TelexNewsletterRequest):
    print(request)
    return {"message": "Telex Newsletter Form"}