import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const themeMap = JSON.parse(
  readFileSync(join(process.cwd(), 'api', 'theme-map.json'), 'utf-8')
);

function h(type, props, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children.length ? children : undefined } };
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const themeId = url.searchParams.get('theme') || 'codex';
  const variantKey = url.searchParams.get('variant') || 'dark';

  const theme = themeMap[themeId];
  if (!theme) { res.status(404).send('Theme not found'); return; }

  const v = theme[variantKey] || theme.dark || theme.light;
  if (!v) { res.status(404).send('Variant not found'); return; }

  // Fetch real like count
  let likes = 0;
  try {
    const likesRes = await fetch('https://acrobatic-corgi-867.convex.site/themes/likes/counts');
    if (likesRes.ok) {
      const counts = await likesRes.json();
      likes = counts[themeId] || 0;
    }
  } catch (e) { /* fail silently */ }

  const isDark = isColorDark(v.surface);
  const codeBg = v.codeBg || v.surface;
  const sidebar = v.sidebar || v.surface;
  const variantLabel = variantKey === 'light' ? 'Light' : 'Dark';
  const mono = 'Menlo, monospace';
  const sans = '-apple-system, sans-serif';

  // Colors
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const dotColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.12)';
  const lineNumColor = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)';
  const mutedText = isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)';
  const brandMuted = isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)';
  const badgeBg = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';
  const paletteBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const commentColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.30)';
  const diffAddedBg = withOpacity(v.diffAdded, 0.10);
  const diffRemovedBg = withOpacity(v.diffRemoved, 0.10);
  const diffAddedLineNum = withOpacity(v.diffAdded, 0.50);
  const diffRemovedLineNum = withOpacity(v.diffRemoved, 0.50);
  const accentBg = withOpacity(v.accent, 0.10);
  const accentLineNum = withOpacity(v.accent, 0.50);

  // Dynamic theme name
  const themeName = `${theme.name} ${variantLabel}`;

  // Scale theme name for long names
  const nameLen = theme.name.length;
  const nameFontSize = nameLen > 20 ? '40px' : nameLen > 12 ? '50px' : '60px';

  // Likes display
  const likesDisplay = likes >= 5 ? formatLikes(likes) : null;

  // Code lines matching the updated Stitch design
  const codeLines = [
    // Line 1: comment (dimmed)
    { num: '1', bg: 'none', opacity: 0.4, parts: [
      { text: `// Initialize ${themeName} optimized config`, color: commentColor },
    ]},
    // Line 2: import { CodexEngine } from "@dexthemes/core";
    { num: '2', bg: 'none', parts: [
      { text: 'import', color: v.accent },
      { text: ' { ', color: v.ink },
      { text: 'CodexEngine', color: v.ink },
      { text: ' } ', color: v.ink },
      { text: 'from', color: v.accent },
      { text: ' ', color: v.ink },
      { text: '"@dexthemes/core"', color: v.skill },
      { text: ';', color: v.ink },
    ]},
    // Line 3: empty
    { num: '3', bg: 'none', parts: [] },
    // Line 4: const config: ThemeConfig = {
    { num: '4', bg: 'none', parts: [
      { text: 'const', color: v.accent },
      { text: ' ', color: v.ink },
      { text: 'config', color: v.ink },
      { text: ': ', color: v.ink },
      { text: 'ThemeConfig', color: v.skill },
      { text: ' = {', color: v.ink },
    ]},
    // Line 5: name: "Codex Dark",
    { num: '5', bg: 'none', parts: [
      { text: '  name', color: v.ink },
      { text: ': ', color: v.ink },
      { text: `"${themeName}"`, color: v.skill },
      { text: ',', color: v.ink },
    ]},
    // Line 6 (diff removed): mode: "legacy-dark",
    { num: '- 6', bg: diffRemovedBg, lineNumColor: diffRemovedLineNum, parts: [
      { text: '  mode', color: v.ink },
      { text: ': ', color: v.ink },
      { text: '"legacy-dark"', color: v.skill },
      { text: ',', color: v.ink },
    ]},
    // Line 7 (diff added): mode: "codex-optimized",
    { num: '+ 7', bg: diffAddedBg, lineNumColor: diffAddedLineNum, parts: [
      { text: '  mode', color: v.ink },
      { text: ': ', color: v.ink },
      { text: '"codex-optimized"', color: v.skill },
      { text: ',', color: v.ink },
    ]},
    // Line 8 (accent highlight): accent: "#0169cc",
    { num: '8', bg: accentBg, lineNumColor: accentLineNum, parts: [
      { text: '  accent', color: v.ink },
      { text: ': ', color: v.ink },
      { text: `"${v.accent}"`, color: v.skill },
      { text: ',', color: v.ink },
    ]},
    // Line 9: };
    { num: '9', bg: 'none', parts: [
      { text: '};', color: v.ink },
    ]},
    // Line 10: empty
    { num: '10', bg: 'none', parts: [] },
    // Line 11: export function init() {
    { num: '11', bg: 'none', parts: [
      { text: 'export function', color: v.accent },
      { text: ' ', color: v.ink },
      { text: 'init', color: v.ink },
      { text: '() {', color: v.ink },
    ]},
    // Line 12: return new CodexEngine(config).apply();
    { num: '12', bg: 'none', parts: [
      { text: '  ', color: v.ink },
      { text: 'return new', color: v.accent },
      { text: ' ', color: v.ink },
      { text: 'CodexEngine', color: v.skill },
      { text: '(config).', color: v.ink },
      { text: 'apply', color: v.accent },
      { text: '();', color: v.ink },
    ]},
    // Line 13: }
    { num: '13', bg: 'none', parts: [
      { text: '}', color: v.ink },
    ]},
  ];

  // 2x3 palette grid colors: codeBg, accent, skill, diffAdded, diffRemoved, ink
  const paletteGrid = [
    codeBg, v.accent,
    v.skill, v.diffAdded,
    v.diffRemoved, v.ink,
  ];

  const element = h('div', {
    style: {
      width: '1200px', height: '630px', display: 'flex',
      background: v.surface, fontFamily: sans, overflow: 'hidden',
    },
  },

    // === LEFT: Editor panel (68%) ===
    h('div', {
      style: {
        display: 'flex', flexDirection: 'column', width: '816px', height: '630px',
        background: codeBg, borderRight: `1px solid ${borderSub}`,
      },
    },
      // Tab bar
      h('div', {
        style: {
          display: 'flex', alignItems: 'center', height: '40px',
          background: sidebar, borderBottom: `1px solid ${borderSub}`,
          padding: '0 16px', gap: '8px',
        },
      },
        // Dots
        h('div', { style: { display: 'flex', gap: '6px', marginRight: '16px' } },
          h('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: dotColor } }),
          h('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: dotColor } }),
          h('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: dotColor } }),
        ),
        // Active tab
        h('div', {
          style: {
            display: 'flex', alignItems: 'center', height: '40px',
            background: codeBg, padding: '0 16px',
            borderTop: `2px solid ${v.accent}`,
            fontFamily: mono, fontSize: '12px', fontWeight: 500,
            color: v.ink,
          },
        },
          h('span', { style: { color: withOpacity(v.accent, 0.8), marginRight: '8px' } }, 'TS'),
          h('span', {}, 'applyTheme.ts'),
        ),
      ),

      // Code content
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column',
          padding: '32px', flex: 1, overflow: 'hidden',
          fontFamily: mono, fontSize: '18px', lineHeight: '1.625',
        },
      },
        ...codeLines.map((line) =>
          h('div', {
            style: {
              display: 'flex',
              background: line.bg === 'none' ? 'transparent' : line.bg,
              opacity: line.opacity || 1,
            },
          },
            // Line number
            h('span', {
              style: {
                width: '48px', flexShrink: 0,
                color: line.lineNumColor || lineNumColor,
                fontFamily: mono, fontSize: '18px',
              },
            }, line.num),
            // Code
            ...(line.parts.length === 0
              ? [h('span', {}, ' ')]
              : line.parts.map((part, j) =>
                  h('span', { style: { color: part.color, whiteSpace: 'pre' } }, part.text)
                )
            ),
          )
        ),
        // Cursor on line 14
        h('div', { style: { display: 'flex', marginTop: '8px' } },
          h('span', { style: { width: '48px', flexShrink: 0, color: lineNumColor, fontFamily: mono, fontSize: '18px' } }, '14'),
          h('div', { style: { width: '8px', height: '24px', background: v.accent } }),
        ),
      ),
    ),

    // === RIGHT: Metadata panel (32%) ===
    h('div', {
      style: {
        display: 'flex', flexDirection: 'column', width: '384px', height: '630px',
        background: sidebar, borderLeft: `1px solid ${borderSub}`,
      },
    },
      // Top section: brand + name + description
      h('div', {
        style: { display: 'flex', flexDirection: 'column', padding: '40px 40px 24px 40px' },
      },
        // Brand row with likes on the right
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            h('div', { style: { width: '20px', height: '20px', borderRadius: '3px', background: v.accent, flexShrink: 0 } }),
            h('span', { style: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: brandMuted } }, 'DEXTHEMES.com'),
          ),
          // Likes (top right, subtle)
          ...(likesDisplay ? [
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6 } },
              h('span', { style: { color: v.skill, fontSize: '14px' } }, '♥'),
              h('span', { style: { fontSize: '10px', fontWeight: 700, color: v.ink } }, likesDisplay),
            ),
          ] : []),
        ),

        // Theme name + badge
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' } },
          h('span', { style: { fontSize: nameFontSize, fontWeight: 700, letterSpacing: '-0.05em', color: v.ink, lineHeight: 1 } }, theme.name),
          h('span', { style: { padding: '2px 8px', borderRadius: '2px', background: badgeBg, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: v.ink } }, variantLabel),
        ),

        // Support line
        h('div', { style: { fontSize: '16px', lineHeight: '1.4', color: mutedText } }, 'Themes for Codex'),
      ),

      // Bottom section: palette grid fills remaining space
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column', flex: 1,
          padding: '0 40px 40px 40px', marginTop: '16px',
        },
      },
        // Label
        h('div', { style: { display: 'flex', marginBottom: '16px' } },
          h('span', { style: { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: withOpacity(v.ink, 0.3) } }, 'COLOR PALETTE'),
        ),

        // 2x3 grid of palette swatches
        h('div', {
          style: {
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            flex: 1, overflow: 'hidden',
          },
        },
          ...paletteGrid.map((c, i) =>
            h('div', {
              style: {
                width: '145px',
                height: '80px',
                borderRadius: '8px', background: c,
                border: `1px solid ${paletteBorder}`,
              },
            })
          ),
        ),
      ),
    ),
  );

  const imageResponse = new ImageResponse(element, { width: 1200, height: 630 });
  const buffer = await imageResponse.arrayBuffer();
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.send(Buffer.from(buffer));
}

function isColorDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function withOpacity(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function formatLikes(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}
