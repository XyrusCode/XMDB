import { Link } from '@tanstack/react-router';
import { IMAGE_BASE_URL, POSTER_SIZE } from '@/config';
import NoImage from '@/assets/no_image.jpg';

interface MediaCardProps {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  year?: string;
}

export function MediaCard({ id, mediaType, title, posterPath, year }: MediaCardProps) {
  const to = mediaType === 'movie' ? '/movie/$movieId' : '/tv/$tvId';
  const params = mediaType === 'movie' ? { movieId: String(id) } : { tvId: String(id) };
  return (
    <Link
      to={to as never}
      params={params as never}
      className="group block flex-shrink-0 w-36 sm:w-40 md:w-44 outline-none"
      aria-label={title}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800 shadow-md transition-transform duration-200 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-white/70">
        <img
          src={posterPath ? `${IMAGE_BASE_URL}${POSTER_SIZE}${posterPath}` : NoImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <p className="mt-2 text-sm font-medium text-foreground line-clamp-2 leading-tight">{title}</p>
      {year && <p className="text-xs text-muted-foreground mt-0.5">{year}</p>}
    </Link>
  );
}
