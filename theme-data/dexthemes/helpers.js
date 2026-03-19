(function () {
  const DARK_DEFAULTS = { diffAdded: '#40c977', diffRemoved: '#fa423e', skill: '#ad7bf9' };
  const LIGHT_DEFAULTS = { diffAdded: '#00a240', diffRemoved: '#ba2623', skill: '#924ff7' };

  function clamp(value) {
    return Math.max(0, Math.min(255, value));
  }

  function shiftHex(hex, amount) {
    const r = clamp(parseInt(hex.slice(1, 3), 16) + amount);
    const g = clamp(parseInt(hex.slice(3, 5), 16) + amount);
    const b = clamp(parseInt(hex.slice(5, 7), 16) + amount);
    return `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')}`;
  }

  function createVariant(mode, variant) {
    const defaults = mode === 'dark' ? DARK_DEFAULTS : LIGHT_DEFAULTS;
    const sidebarShift = mode === 'dark' ? -7 : -10;
    const codeBgShift = mode === 'dark' ? -12 : -14;
    return {
      contrast: mode === 'dark' ? 64 : 46,
      ...defaults,
      ...variant,
      sidebar: variant.sidebar || shiftHex(variant.surface, sidebarShift),
      codeBg: variant.codeBg || shiftHex(variant.surface, codeBgShift),
    };
  }

  function createDexTheme({
    id,
    name,
    dateAdded = '2026-03-14',
    copies = 0,
    accents,
    light,
    dark,
    variants,
    _company,
    _hiddenUntilUnlocked,
    _locked,
    _summary,
  }) {
    const theme = {
      id,
      name,
      codeThemeId: 'codex',
      copies,
      dateAdded,
    };

    if (_company) theme._company = _company;
    if (_hiddenUntilUnlocked) theme._hiddenUntilUnlocked = _hiddenUntilUnlocked;
    if (_locked) theme._locked = _locked;
    if (_summary) theme._summary = _summary;

    if (dark) theme.dark = createVariant('dark', dark);
    if (light) theme.light = createVariant('light', light);
    if (variants) theme.variants = variants;

    theme.accents =
      accents ||
      [theme.dark?.accent, theme.light?.accent].filter((value, index, array) => value && array.indexOf(value) === index);

    return theme;
  }

  function registerDexThemesPack(group, themes) {
    const root = (window.DEXTHEMES_PACKS ||= { dexthemes: {} });
    const mapped = themes.map((theme) => ({
      ...theme,
      category: 'dexthemes',
      subgroup: group,
    }));
    // Append to existing group if it already exists (supports multiple files per group)
    root.dexthemes[group] = (root.dexthemes[group] || []).concat(mapped);
  }

  window.createDexTheme = createDexTheme;
  window.registerDexThemesPack = registerDexThemesPack;
  window.DEXTHEMES_GROUP_LABELS = {
    anime: 'Anime',
    games: 'Video Games',
    movies: 'Movies',
    comics: 'Comics',
    zodiacs: 'Zodiacs',
    lunar: 'Lunar Animals',
    companies: 'Companies',
    originals: 'Originals',
    supporter: 'Unlockables',
    supporters: 'Unlockables',
  };
})();
