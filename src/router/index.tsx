import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  notFound,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/components/layouts/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { MoviePage } from '@/pages/MoviePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { movieQueryOptions } from '@/queries/use-movie';
import { isApiError } from '@/api/client';
import { queryClient } from '@/queries/query-client';
import { isValidMovieId, parseMovieId, stringifyMovieId } from '@/router/params';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$movieId',
  params: { parse: parseMovieId, stringify: stringifyMovieId },
  // notFound() here, rather than throwing from params.parse: a parse that
  // throws is caught by the router and sent to errorComponent, which rendered
  // /asdf as "could not load this film" instead of a 404.
  beforeLoad: ({ params }) => {
    if (!isValidMovieId(params.movieId)) throw notFound();
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(movieQueryOptions(params.movieId)),
  errorComponent: ({ error }) => {
    // A valid-looking id that TMDB has no film for is a 404, not a crash.
    if (isApiError(error) && error.status === 404) return <NotFoundPage />;
    return (
      <div role="alert" className="border border-grease p-6">
        <p className="edge text-grease">Could not load this film</p>
        <p className="mt-2 text-sm text-foreground">
          {isApiError(error) ? error.message : 'Something went wrong.'}
        </p>
      </div>
    );
  },
  component: function MovieRouteComponent() {
    const { movieId } = movieRoute.useParams();
    return <MoviePage movieId={movieId} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, movieRoute]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultNotFoundComponent: NotFoundPage,
  // Preload on hover — the sheet is a grid of hoverable frames, which is the
  // ideal case for it.
  defaultPreload: 'intent',
  // Let React Query's staleTime be the only cache authority; otherwise the
  // router keeps a second, disagreeing one.
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
