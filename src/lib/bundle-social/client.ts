const BUNDLE_API = 'https://info.bundle.social/api';

export async function createTeam(name: string) {
  const key = process.env.BUNDLE_SOCIAL_API_KEY;
  if (!key) throw new Error('BUNDLE_SOCIAL_API_KEY not configured');

  const res = await fetch(`${BUNDLE_API}/team`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error(`Bundle Social team creation failed: ${res.status}`);
  return res.json();
}
