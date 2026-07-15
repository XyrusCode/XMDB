import { Link } from '@tanstack/react-router';
import { GreasePencilRing } from '@/components/global/GreasePencilRing';
import { IMAGE_BASE_URL, THUMB_SIZE } from '@/config';
import NoImage from '@/assets/no_image.jpg';

interface FrameProps {
  movieId: number;
  title: string;
  posterPath: string | null;
  /** Position in TMDB's popularity order — a real sequence, so it gets a number. */
  frameNumber: number;
  year: string;
}

export const Frame = ({ movieId, title, posterPath, frameNumber, year }: FrameProps) => (
  <li className="group relative">
    <Link
      to="/$movieId"
      params={{ movieId }}
      className="block rounded-xs outline-none"
      aria-label={`${title}${year ? `, ${year}` : ''}`}
    >
      <div className="relative bg-rebate p-1.5">
        <div className="perfs absolute inset-y-0 left-0 w-1.5" aria-hidden="true" />
        <div className="perfs absolute inset-y-0 right-0 w-1.5" aria-hidden="true" />

        <div className="relative mx-1.5 aspect-2/3 overflow-hidden bg-sheet">
          <img
            src={posterPath ? `${IMAGE_BASE_URL}${THUMB_SIZE}${posterPath}` : NoImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {/* has-[:focus-visible], not focus-within: the ring should answer a
              keyboard user, not flash on every mouse click. Matches the
              selector that drives the stroke animation in globals.css. */}
          <GreasePencilRing className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100" />
        </div>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="edge tabular-nums">{String(frameNumber).padStart(2, '0')}</span>
        <span className="edge truncate text-right">{year}</span>
      </div>
      <p className="mt-0.5 truncate text-[0.8125rem] leading-tight text-foreground">{title}</p>
    </Link>
  </li>
);
