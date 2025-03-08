import MovieCard from '../components/MovieCard';

async function getNowPlayingMovies() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies/now-playing`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  return res.json();
}

export default async function Home() {
  const data = await getNowPlayingMovies();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Now Showing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.results.map((movie: any) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            voteAverage={movie.vote_average}
          />
        ))}
      </div>
    </main>
  );
}
