const TMDB_BASE = 'https://api.themoviedb.org/3';

function getAuthHeaders(): Record<string, string> {
  const token = process.env.TMDB_TOKEN || process.env.VITE_TMDB_TOKEN; // allow either for flexibility
  const key = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  if (key) {
    return {};
  }
  throw new Error('Missing TMDB credentials on server: set TMDB_TOKEN (v4) or TMDB_API_KEY (v3)');
}

export async function tmdbFetch(path: string, params: Record<string, string | number | undefined> = {}) {
  const token = process.env.TMDB_TOKEN || process.env.VITE_TMDB_TOKEN;
  const key = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  const url = new URL(TMDB_BASE + path);
  // Always set language default
  if (!params.language) params.language = 'en-US';
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  if (!token && key) {
    url.searchParams.set('api_key', key);
  }
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...getAuthHeaders(),
  };
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const text = await res.text();
    let msg = `TMDB error ${res.status}`;
    try {
      const j = JSON.parse(text);
      if (j.status_message) msg = j.status_message;
    } catch {}
    const err = new Error(msg) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return res.json();
}
