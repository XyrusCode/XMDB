import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => (
  <div className="border-t border-sprocket py-24 text-center">
    <p className="edge">No such frame</p>
    <h1
      className="display mt-3 text-[clamp(2rem,6vw,3.5rem)]"
      style={{ '--wdth': '78%' } as React.CSSProperties}
    >
      Nothing on this strip
    </h1>
    <p className="mx-auto mt-4 max-w-sm text-sm text-pencil">
      That page isn&rsquo;t part of the sheet. It may have been mislabelled, or never shot.
    </p>
    <div className="mt-8">
      <Button variant="outline" render={<Link to="/">Back to the sheet</Link>} />
    </div>
  </div>
);
