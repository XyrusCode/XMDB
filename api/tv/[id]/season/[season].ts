import { tmdbFetch } from '../../../../_lib/tmdb';

export default async function handler(req: any, res: any) {
  try {
    const { id, season } = req.query;
    if (!id || Array.isArray(id) || !season || Array.isArray(season)) {
      return res.status(400).json({ status_message: 'Missing id or season' });
    }
    const data = await tmdbFetch(`/tv/${id}/season/${season}`, { language: 'en-US' });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    res.status(err.status || 500).json({ status_message: err.message || 'Server error' });
  }
}
