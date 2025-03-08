from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session, Booking, Seat, create_tables
from contextlib import asynccontextmanager
from models import SeatBooking, BookingResponse
load_dotenv()

# Startup event
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await create_tables()
        yield
    finally:
        print("Table Creation")

app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/movies/now-playing")
async def get_now_playing():
    try:
        response = requests.get(
            f"https://api.themoviedb.org/3/movie/now_playing",
            params={
                "api_key": os.getenv("TMDB_API_KEY"),
                "language": "en-US",
                "page": 1
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    try:
        response = requests.get(
            f"https://api.themoviedb.org/3/movie/{movie_id}",
            params={
                "api_key": os.getenv("TMDB_API_KEY"),
                "language": "en-US"
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/movies/{movie_id}/seats")
async def get_booked_seats(
    movie_id: int, 
    screening_time: str,
    session: AsyncSession = Depends(get_session)
):
    # Query bookings for the movie and screening time
    query = select(Booking).where(
        Booking.movie_id == movie_id,
        Booking.screening_time == screening_time
    )
    result = await session.execute(query)
    bookings = result.scalars().all()

    # Get all booked seats
    booked_seats = []
    for booking in bookings:
        seat_query = select(Seat).where(Seat.booking_id == booking.booking_id)
        seat_result = await session.execute(seat_query)
        seats = seat_result.scalars().all()
        booked_seats.extend([seat.seat_number for seat in seats])

    return {"booked_seats": booked_seats}

@app.post("/api/bookings", response_model=BookingResponse)
async def create_booking(
    booking: SeatBooking,
    session: AsyncSession = Depends(get_session)
):
    # Check if seats are already booked
    existing_seats_query = select(Seat).join(Booking).where(
        Booking.movie_id == booking.movie_id,
        Booking.screening_time == booking.screening_time
    )
    result = await session.execute(existing_seats_query)
    existing_seats = result.scalars().all()
    booked_seat_numbers = [seat.seat_number for seat in existing_seats]

    # Check for conflicts
    for seat in booking.seats:
        if seat in booked_seat_numbers:
            raise HTTPException(status_code=400, detail=f"Seat {seat} is already booked")

    # Create new booking
    booking_id = f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}"
    new_booking = Booking(
        booking_id=booking_id,
        movie_id=booking.movie_id,
        screening_time=booking.screening_time,
        user_email=booking.user_email
    )
    session.add(new_booking)

    # Create seat records
    for seat in booking.seats:
        new_seat = Seat(booking_id=booking_id, seat_number=seat)
        session.add(new_seat)

    await session.commit()

    return BookingResponse(
        booking_id=booking_id,
        movie_id=booking.movie_id,
        seats=booking.seats,
        screening_time=booking.screening_time,
        user_email=booking.user_email,
        status="confirmed"
    )

