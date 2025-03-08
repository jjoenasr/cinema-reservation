from pydantic import BaseModel
from typing import List

class SeatBooking(BaseModel):
    movie_id: int
    seats: List[str]
    screening_time: str
    user_email: str

class BookingResponse(BaseModel):
    booking_id: str
    movie_id: int
    seats: List[str]
    screening_time: str
    user_email: str
    status: str