import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
}

const MovieCard = ({ id, title, posterPath, releaseDate, voteAverage }: MovieCardProps) => {
  return (
    <Link href={`/movies/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
        <div className="relative h-[300px] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {new Date(releaseDate).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              ★ {voteAverage.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 