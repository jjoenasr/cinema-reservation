# Cinema Reservation App

A full-stack cinema reservation application built with Next.js, FastAPI, and TMDB API.

## Features

- Browse now showing movies from TMDB API
- View detailed movie information
- Interactive seat selection
- Seat booking system
- Real-time seat availability checking

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- TMDB API key (get it from [TMDB website](https://www.themoviedb.org/documentation/api))

## Setup

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd next-cinema
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your TMDB API key:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend (FastAPI)

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file and add your TMDB API key:
   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Browse the list of now showing movies
3. Click on a movie to view details and book seats
4. Select your desired seats and complete the booking

## API Endpoints

- `GET /api/movies/now-playing` - Get list of now showing movies
- `GET /api/movies/{movie_id}` - Get movie details
- `GET /api/movies/{movie_id}/seats` - Get booked seats for a movie
- `POST /api/bookings` - Create a new booking

## Tech Stack

- Frontend:
  - Next.js
  - Tailwind CSS
  - TypeScript
- Backend:
  - FastAPI
  - Python
  - SQLAlchemy
- External APIs:
  - TMDB API