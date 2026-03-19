import { STATIC_THEME_CATALOG, normalizeDexThemesSubgroup } from '../shared/theme-api-catalog.js';

export const config = { runtime: 'edge' };

const COMMUNITY_THEMES_URL = 'https://acrobatic-corgi-867.convex.site/themes/community';

async function fetchCommunityThemes() {
  const res = await fetch(COMMUNITY_THEMES_URL, {
    headers: { Origin: 'https://www.dexthemes.com' },
  });
  if (!res.ok) return [];
  return res.json();
}

function filterThemes(themes, { id, search, variant, category, subgroup }) {
  let results = themes;

  if (id) {
    results = results.filter((theme) => theme.id === id || theme.themeId === id);
  }

  if (category) {
    results = results.filter((theme) => theme.category === category);
  }

  if (subgroup) {
    const normalized = normalizeDexThemesSubgroup(subgroup);
    if (normalized) {
      results = results.filter(
        (theme) => theme.category === 'dexthemes' && normalizeDexThemesSubgroup(theme.subgroup) === normalized,
      );
    } else {
      results = [];
    }
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter((theme) => theme.name.toLowerCase().includes(q));
  }

  if (variant === 'dark') {
    results = results.filter((theme) => theme.dark);
  } else if (variant === 'light') {
    results = results.filter((theme) => theme.light);
  }

  return results;
}

function visibleStaticThemes() {
  return STATIC_THEME_CATALOG.filter((theme) => !theme._hiddenUntilUnlocked);
}

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const search = url.searchParams.get('q');
  const variant = url.searchParams.get('variant');
  const category = url.searchParams.get('category');
  const subgroup = url.searchParams.get('subgroup');

  const communityThemes = await fetchCommunityThemes();
  const allThemes = [...visibleStaticThemes(), ...communityThemes];
  const results = filterThemes(allThemes, { id, search, variant, category, subgroup });

  return new Response(
    JSON.stringify({
      count: results.length,
      themes: results,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
      },
    },
  );
}
