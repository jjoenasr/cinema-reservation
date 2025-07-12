from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator

# Create async engine
DATABASE_URL = "sqlite+aiosqlite:///./cinema.db"
engine = create_async_engine(DATABASE_URL, echo=True)

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

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Create async session
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

# Create tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all) 