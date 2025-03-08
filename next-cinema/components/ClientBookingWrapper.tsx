"use client";

import dynamic from 'next/dynamic';

const BookingSection = dynamic(() => import('./BookingSection'), {
  ssr: false
});

interface ClientBookingWrapperProps {
  movieId: number;
  movieTitle: string;
}

export default function ClientBookingWrapper({ movieId, movieTitle }: ClientBookingWrapperProps) {
  return <BookingSection movieId={movieId} movieTitle={movieTitle} />;
} 