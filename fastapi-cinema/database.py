from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, ARRAY, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator

# Create async engine
engine = create_async_engine("sqlite+aiosqlite:///./cinema.db", echo=True)

# Create declarative base
class Base(DeclarativeBase):
    pass

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String, unique=True, index=True)
    movie_id = Column(Integer)
    screening_date = Column(Date)
    screening_time = Column(String)
    user_email = Column(String)
    
class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String, ForeignKey("bookings.booking_id"))
    seat_number = Column(String)

# Create async session
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

# Create tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all) 