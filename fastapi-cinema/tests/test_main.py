import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from main import app

# -------------
# Sync testing
# -------------
client = TestClient(app)

def test_get_now_playing():
    response = client.get("/api/movies/now-playing")
    assert response.status_code == 200
    assert "results" in response.json()

def test_get_movie_details():
    # Assuming a valid movie ID from TMDB, e.g., 550 (Fight Club)
    response = client.get("/api/movies/550")
    assert response.status_code == 200
    assert "title" in response.json()

# -------------
# Async testing
# -------------

@pytest.mark.anyio
async def test_get_booked_seats(async_client: AsyncClient):
    response = await async_client.get("/api/movies/550/seats?screening_date=2025-07-12&screening_time=18:00")
    assert response.status_code == 200
    assert "booked_seats" in response.json()

@pytest.mark.anyio
async def test_create_booking(async_client: AsyncClient):
    booking_data = {
        "movie_id": 550,
        "screening_date": "2025-07-12",
        "screening_time": "20:00",
        "seats": ["B1", "B2"],
        "user_email": "test@example.com"
    }
    response = await async_client.post("/api/bookings", json=booking_data)
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["movie_id"] == 550
    assert response_json["seats"] == ["B1", "B2"]
    assert response_json["status"] == "confirmed"

@pytest.mark.anyio
async def test_create_booking_with_conflict(async_client: AsyncClient):
    # Pre-existing booking
    booking_data = {
        "movie_id": 550,
        "screening_date": "2025-07-12",
        "screening_time": "22:00",
        "seats": ["C1"],
        "user_email": "test1@example.com"
    }
    response = await async_client.post("/api/bookings", json=booking_data)
    assert response.status_code == 200

    # Attempt to book the same seat
    booking_data['user_email'] = "test2@example.com"
    response = await async_client.post("/api/bookings", json=booking_data)
    assert response.status_code == 400
    assert "already booked" in response.json()["detail"]