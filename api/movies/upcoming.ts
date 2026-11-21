import { tmdbFetch } from '../../_lib/tmdb';

export default async function handler(req: any, res: any) {
  try {
    const page = typeof req.query.page === 'string' ? req.query.page : '1';
    const data = await tmdbFetch('/movie/upcoming', { page, language: 'en-US' });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    res.status(err.status || 500).json({ status_message: err.message || 'Server error' });
  }
}
