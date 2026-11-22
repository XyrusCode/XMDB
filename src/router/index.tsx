import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  notFound,
  Link,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/components/layouts/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { MoviePage } from '@/pages/MoviePage';
import { TVPage } from '@/pages/TVPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { movieQueryOptions } from '@/queries/use-movie';
import { tvQueryOptions } from '@/queries/use-tv';
import { WatchlistPage } from '@/pages/WatchlistPage';
import { isApiError } from '@/api/client';
import { queryClient } from '@/queries/query-client';

function parseId(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 && Number.isInteger(n) ? n : NaN;
}
function isValidId(s: string) {
  return !Number.isNaN(parseId(s));
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-6 text-sm sm:text-base">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          Try again
        </button>
        <Link
          to="/"
          className="px-5 py-2.5 rounded border border-border text-foreground font-semibold text-sm hover:bg-white/10 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: RootErrorComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movie/$movieId',
  beforeLoad: ({ params }) => {
    if (!isValidId(params.movieId)) throw notFound();
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(movieQueryOptions(parseId(params.movieId))),
  errorComponent: ({ error }) => {
    if (isApiError(error) && error.status === 404) return <NotFoundPage />;
    return (
      <div role="alert" className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-xl font-semibold text-foreground mb-2">Couldn’t load this movie</p>
        <p className="text-muted-foreground mb-6">{isApiError(error) ? error.message : 'Something went wrong.'}</p>
        <Link to="/" className="text-cyan-400 hover:underline">← Back to discover</Link>
      </div>
    );
  },
  component: function MovieRouteComponent() {
    const { movieId } = movieRoute.useParams();
    return <MoviePage movieId={parseId(movieId)} />;
  },
});

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  component: WatchlistPage,
});

const tvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tv/$tvId',
  beforeLoad: ({ params }) => {
    if (!isValidId(params.tvId)) throw notFound();
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(tvQueryOptions(parseId(params.tvId))),
  errorComponent: ({ error }) => {
    if (isApiError(error) && error.status === 404) return <NotFoundPage />;
    return (
      <div role="alert" className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-xl font-semibold text-foreground mb-2">Couldn’t load this series</p>
        <p className="text-muted-foreground mb-6">{isApiError(error) ? error.message : 'Something went wrong.'}</p>
        <Link to="/" className="text-cyan-400 hover:underline">← Back to discover</Link>
      </div>
    );
  },
  component: function TVRouteComponent() {
    const { tvId } = tvRoute.useParams();
    return <TVPage tvId={parseId(tvId)} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, watchlistRoute, movieRoute, tvRoute]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultNotFoundComponent: NotFoundPage,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
