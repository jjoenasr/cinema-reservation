import Image from 'next/image';
import ClientBookingWrapper from '@/components/ClientBookingWrapper';

async function getMovieDetails(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return res.json();
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-[500px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-600 mb-4">{movie.overview}</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="font-semibold text-gray-700">Release Date</h3>
              <p>{new Date(movie.release_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Rating</h3>
              <p>★ {movie.vote_average.toFixed(1)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Runtime</h3>
              <p>{movie.runtime} minutes</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Language</h3>
              <p>{movie.original_language.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <ClientBookingWrapper movieId={movie.id} movieTitle={movie.title} />
    </main>
  );
} 