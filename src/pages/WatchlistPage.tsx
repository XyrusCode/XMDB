import { SEO } from '@/components/global/SEO';
import { WatchlistGrid } from '@/components/data-grid/WatchlistGrid';

export const WatchlistPage = () => (
  <>
    <SEO title="Watchlist" description="Your saved movies and TV series." />
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Watchlist</h1>
      <WatchlistGrid />
    </div>
  </>
);
