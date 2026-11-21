import { tmdbFetch } from '../_lib/tmdb';

export default async function handler(req: any, res: any) {
  try {
    const q = typeof req.query.query === 'string' ? req.query.query : '';
    const page = typeof req.query.page === 'string' ? req.query.page : '1';
    if (!q) return res.status(200).json({ page: 1, results: [], total_pages: 0, total_results: 0 });
    const data = await tmdbFetch('/search/movie', { query: q, page, language: 'en-US' });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    res.status(err.status || 500).json({ status_message: err.message || 'Server error' });
  }
}
