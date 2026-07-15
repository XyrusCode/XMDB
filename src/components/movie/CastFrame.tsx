import { IMAGE_BASE_URL, PROFILE_SIZE } from '@/config';
import type { CastMember } from '@/types/tmdb';
import NoImage from '@/assets/no_image.jpg';

/** The cast is a contact sheet too — same frame, faces instead of posters. */
export const CastFrame = ({ actor }: { actor: CastMember }) => (
  <li>
    <div className="relative bg-rebate p-1.5">
      <div className="perfs absolute inset-y-0 left-0 w-1.5" aria-hidden="true" />
      <div className="perfs absolute inset-y-0 right-0 w-1.5" aria-hidden="true" />
      <div className="mx-1.5 aspect-2/3 overflow-hidden bg-sheet">
        <img
          src={actor.profile_path ? `${IMAGE_BASE_URL}${PROFILE_SIZE}${actor.profile_path}` : NoImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
    <p className="mt-1.5 truncate text-[0.8125rem] leading-tight text-foreground">{actor.name}</p>
    <p className="edge truncate">{actor.character}</p>
  </li>
);
