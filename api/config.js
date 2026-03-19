export default function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = [
    'https://dexthemes.com',
    'https://www.dexthemes.com',
    'http://localhost:8080',
    'http://localhost:3000',
  ];
  const corsOrigin = allowed.includes(origin) ? origin : allowed[0];

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json({
    statsigClientKey: process.env.STATSIG_CLIENT_KEY || '',
  });
}
