import pytest
from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)

@pytest.fixture
def valid_newsletter_data():
    return {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "interval": "daily"
    }

@pytest.fixture
def valid_generate_data():
    return {
        "message": "/embed-form",
        "settings": [
            {
                "default": "test-channel-id",
                "label": "channel_id",
                "required": True
            },
            {
                "default": "Test Form",
                "label": "form_name",
                "required": True
            },
            {
                "default": "https://example.com/logo.png",
                "label": "logo_url",
                "required": True
            }
        ]
    }

def test_hello_endpoint():
    response = client.get("/api/py/helloFastApi")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from FastAPI"}

def test_integration_endpoint():
    response = client.get("/api/py/integration.json")
    assert response.status_code == 200
    assert "data" in response.json()

def test_generate_endpoint_success(valid_generate_data):
    response = client.post("/api/py/generate", json=valid_generate_data)
    assert response.status_code == 200
    assert response.json()["event_name"] == "Form URL Generated"
    assert response.json()["status"] == "success"

def test_generate_endpoint_invalid_message():
    invalid_data = {
        "message": "invalid",
        "settings": []
    }
    response = client.post("/api/py/generate", json=invalid_data)
    assert response.status_code == 400
    assert response.json()["event_name"] == "Invalid Command"

def test_newsletter_subscription_success(valid_newsletter_data):
    channel_id = "test-channel-id"
    response = client.post(
        f"/api/py/telex-newsletter/{channel_id}", 
        json=valid_newsletter_data
    )
    assert response.status_code == 200

def test_newsletter_subscription_invalid_data():
    invalid_data = {
        "firstname": "J",  # Too short
        "lastname": "Doe",
        "email": "invalid-email",  # Invalid email
        "interval": "hourly"  # Invalid interval
    }
    channel_id = "test-channel-id"
    response = client.post(
        f"/api/py/telex-newsletter/{channel_id}", 
        json=invalid_data
    )
    assert response.status_code == 422
    errors = response.json()["detail"]
    
    # Check for specific validation errors
    error_fields = {error["loc"][1]: error["type"] for error in errors}
    assert "firstname" in error_fields  # Check firstname length error
    assert "email" in error_fields     # Check email format error
    assert "interval" in error_fields   # Check interval value error