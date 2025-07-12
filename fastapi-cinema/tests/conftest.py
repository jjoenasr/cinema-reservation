# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from httpx import AsyncClient, ASGITransport
from main import app
from database import Base, get_session, Seat, Booking
from typing import AsyncGenerator

# Configure pytest to use asyncio for async tests
@pytest.fixture(scope="session", autouse=True)
def anyio_backend():
    return "asyncio"

# Create test engine and session
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=True)
TestSessionLocal = sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

# Override dependency used in FastAPI
async def override_get_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionLocal() as session:
        yield session

# Apply override for tests
app.dependency_overrides[get_session] = override_get_session

# Prepare test database
@pytest.fixture(scope="session", autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield 
    # teardown
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

# Create a TestClient for asynchronous tests
@pytest.fixture
async def async_client(setup_db):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as ac:
        yield ac




