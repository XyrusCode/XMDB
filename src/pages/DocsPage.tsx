import { SEO } from '@/components/global/SEO';
import { CodeBlock } from '@/components/highlight/CodeBlock';
import { libraryStore } from '@/lib/library';

const example = {
  '@context': 'https://schema.org',
  '@type': 'Movie',
  name: 'Kimi R5',
  datePublished: '2026-11-01',
  image: 'https://image.tmdb.org/t/p/w500/abc123.jpg',
  director: ['Rohit redigher'],
  description: 'A short overview of the film.',
};

export const DocsPage = () => (
  <>
    <SEO title="Docs" description="XMDB features and structured data format." />
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold">Docs &amp; structured data</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What this app does</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Streaming-style discovery for movies and TV shows with trending, upcoming, anime,
          K-dramas and C-dramas. Your watchlist, watched movies and episode progress live in
          this browser via localStorage — there is no account.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Detailed structured data is emitted for every movie page (Schema.org JSON-LD), so
          data consumers can index your library pages directly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example — JSON-LD for a movie</h2>
        <p className="text-sm text-muted-foreground">
          This is the shape every movie detail page emits (styled via the shared highlighter):
        </p>
        <CodeBlock code={JSON.stringify(example, null, 2)} lang="json" title="movie.json-ld" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Local library</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Region: {libraryStore.state.region || 'US'}
          <br />
          Watchlist: {libraryStore.state.watchlist.length}
          <br />
          Watched movies: {libraryStore.state.watchedMovies.length}
        </p>
      </section>
    </div>
  </>
);
