registerDexThemesPack('supporter', [
  // ── Patron ──────────────────────────────────────────────────────────────
  // Opulent gold / luxury theme for supporters. Dark: gold-accented dark room.
  // Light: sunlit marble with warm gold highlights. Unlocked by buying a coffee.
  createDexTheme({
    id: 'patron',
    name: 'Patron',
    copies: 0,
    _summary: 'Opulent gold and warm marble for a quiet, supporter-only lounge.',
    dark: {
      surface: '#0F0D09',
      ink: '#FFF5DC',
      accent: '#D4A54A',
      contrast: 68,
      diffAdded: '#5CB870',
      diffRemoved: '#E05A4F',
      skill: '#C9A0DC',
      sidebar: '#0A0805',
      codeBg: '#080703',
    },
    light: {
      surface: '#FAF5EC',
      ink: '#2C2416',
      accent: '#A87B1E',
      contrast: 50,
      diffAdded: '#1D8A42',
      diffRemoved: '#B33024',
      skill: '#8855BB',
      sidebar: '#F2ECDF',
      codeBg: '#EDE6D6',
    },
    accents: ['#D4A54A', '#A87B1E'],
  }),

  // ── Seraphim ──────────────────────────────────────────────────────────
  // Angelic / ethereal theme. Dark: starlit cathedral with faint gold.
  // Light: clouds at dawn with celestial blues. Unlocked by creating a theme.
  createDexTheme({
    id: 'seraphim',
    name: 'Seraphim',
    copies: 0,
    _summary: 'Celestial blue light and cathedral calm with a soft, angelic glow.',
    dark: {
      surface: '#0B0E18',
      ink: '#EAF0FF',
      accent: '#7EB4F0',
      contrast: 62,
      diffAdded: '#48C78E',
      diffRemoved: '#E86B6B',
      skill: '#D1A6F0',
      sidebar: '#080B14',
      codeBg: '#06080F',
    },
    light: {
      surface: '#F5F8FF',
      ink: '#1C2235',
      accent: '#4A7FCC',
      contrast: 48,
      diffAdded: '#18874A',
      diffRemoved: '#C03030',
      skill: '#9565CC',
      sidebar: '#EBEFFA',
      codeBg: '#E4E9F6',
    },
    accents: ['#7EB4F0', '#4A7FCC'],
  }),

  // ── Mint Condition ────────────────────────────────────────────────────
  // Money / prosperity theme. Dark: vault with deep greens and subtle gold.
  // Light: crisp paper whites with rich currency greens. Unlocked by sharing on X.
  createDexTheme({
    id: 'mint-condition',
    name: 'Mint Condition',
    copies: 0,
    _summary: 'Vault greens and crisp paper whites with polished prosperity energy.',
    dark: {
      surface: '#090E0B',
      ink: '#E8F5EC',
      accent: '#4FBF7A',
      contrast: 65,
      diffAdded: '#44D490',
      diffRemoved: '#E4605A',
      skill: '#B08FDB',
      sidebar: '#060A07',
      codeBg: '#040804',
    },
    light: {
      surface: '#F4FAF5',
      ink: '#1A2B20',
      accent: '#2D8C54',
      contrast: 50,
      diffAdded: '#1A8544',
      diffRemoved: '#B82E2E',
      skill: '#7E52B3',
      sidebar: '#E9F3EB',
      codeBg: '#E0ECDF',
    },
    accents: ['#4FBF7A', '#2D8C54'],
  }),

  // ── Cupid's Code ──────────────────────────────────────────────────────
  // Valentine's / love theme. Romantic rose pinks, deep reds, warm tones.
  // Unlocked by signing in.
  createDexTheme({
    id: 'cupids-code',
    name: "Cupid's Code",
    copies: 0,
    _summary: 'Romantic rose warmth and velvet reds written like a love letter.',
    dark: {
      surface: '#140B0E',
      ink: '#FFE8EE',
      accent: '#E0708A',
      contrast: 63,
      diffAdded: '#50C484',
      diffRemoved: '#D94F5A',
      skill: '#C490D8',
      sidebar: '#100709',
      codeBg: '#0D0507',
    },
    light: {
      surface: '#FFF4F6',
      ink: '#2D1820',
      accent: '#C44466',
      contrast: 48,
      diffAdded: '#1B8946',
      diffRemoved: '#A82D3E',
      skill: '#9A5CB8',
      sidebar: '#F8E9ED',
      codeBg: '#F2DFE5',
    },
    accents: ['#E0708A', '#C44466'],
  }),

  // ── Heartbeat ──────────────────────────────────────────────────────
  // Cherry-red pulse with warm vitality. Unlocked by liking a theme.
  createDexTheme({
    id: 'heartbeat',
    name: 'Heartbeat',
    copies: 0,
    _summary: 'A pulsing cherry red palette with bright warmth and steady momentum.',
    dark: {
      surface: '#180A0A',
      ink: '#FFE0E0',
      accent: '#E84057',
      contrast: 64,
      diffAdded: '#4FCA80',
      diffRemoved: '#E84057',
      skill: '#D88CCF',
      sidebar: '#130606',
      codeBg: '#100404',
    },
    light: {
      surface: '#FFF5F5',
      ink: '#2D1018',
      accent: '#C62840',
      contrast: 48,
      diffAdded: '#1D8848',
      diffRemoved: '#B82030',
      skill: '#A050A8',
      sidebar: '#F8E8EA',
      codeBg: '#F2DEE2',
    },
    accents: ['#E84057', '#C62840'],
  }),

  // ── Summit ─────────────────────────────────────────────────────────
  // Alpine slate with gold peak accents. Unlocked by reaching Top 10 monthly.
  createDexTheme({
    id: 'summit',
    name: 'Summit',
    copies: 0,
    _summary: 'Alpine slate and gold peak accents for a sharp, high-altitude focus.',
    dark: {
      surface: '#0E1018',
      ink: '#E8ECF4',
      accent: '#F0C050',
      contrast: 64,
      diffAdded: '#50C880',
      diffRemoved: '#E86060',
      skill: '#B8A0E0',
      sidebar: '#0A0C14',
      codeBg: '#080A10',
    },
    light: {
      surface: '#F8F6F0',
      ink: '#1C1E28',
      accent: '#C89820',
      contrast: 48,
      diffAdded: '#1A8844',
      diffRemoved: '#B83030',
      skill: '#7850B8',
      sidebar: '#F0ECE4',
      codeBg: '#E8E4DA',
    },
    accents: ['#F0C050', '#C89820'],
  }),

  // ── The Builder ────────────────────────────────────────────────────
  // Industrial workshop orange on dark steel. Unlocked by making an API call.
  createDexTheme({
    id: 'the-builder',
    name: 'The Builder',
    copies: 0,
    _summary: 'Dark steel and workshop orange with the energy of making something real.',
    dark: {
      surface: '#121416',
      ink: '#E8E4E0',
      accent: '#E8802A',
      contrast: 66,
      diffAdded: '#4CC87A',
      diffRemoved: '#E05550',
      skill: '#C090E0',
      sidebar: '#0D0F11',
      codeBg: '#0A0C0E',
    },
    light: {
      surface: '#F8F6F2',
      ink: '#1C1A18',
      accent: '#C06018',
      contrast: 50,
      diffAdded: '#1D8844',
      diffRemoved: '#B83028',
      skill: '#8050B0',
      sidebar: '#F0EEEA',
      codeBg: '#E8E6E0',
    },
    accents: ['#E8802A', '#C06018'],
  }),

  // ── Kaleidoscope ───────────────────────────────────────────────────
  // Vibrant prismatic rainbow. Really colorful. Unlocked by using Color Me Lucky.
  createDexTheme({
    id: 'kaleidoscope',
    name: 'Kaleidoscope',
    copies: 0,
    _summary: 'A prismatic burst of neon color that turns every pane into confetti.',
    dark: {
      surface: '#0E0A14',
      ink: '#F0E8FF',
      accent: '#E850E8',
      contrast: 64,
      diffAdded: '#40E890',
      diffRemoved: '#FF5070',
      skill: '#50C8FF',
      sidebar: '#0A0610',
      codeBg: '#08050D',
    },
    light: {
      surface: '#FFF8FC',
      ink: '#1A1028',
      accent: '#C030C0',
      contrast: 48,
      diffAdded: '#18A050',
      diffRemoved: '#D02050',
      skill: '#2090D0',
      sidebar: '#F8F0F8',
      codeBg: '#F0E8F4',
    },
    accents: ['#E850E8', '#FF5070', '#50C8FF', '#40E890'],
  }),

  // ── Agent Claw ─────────────────────────────────────────────────────
  // PCB green traces on dark board. Techy/digital. Unlocked by AI agent usage.
  // A play on OpenClaw.
  createDexTheme({
    id: 'agent-claw',
    name: 'Agent Claw',
    copies: 0,
    _summary: 'Circuit-board greens and luminous traces for a tool-built, agentic feel.',
    dark: {
      surface: '#0A100A',
      ink: '#D8F0D8',
      accent: '#00E870',
      contrast: 66,
      diffAdded: '#40D080',
      diffRemoved: '#E85050',
      skill: '#60C0E0',
      sidebar: '#060C06',
      codeBg: '#040A04',
    },
    light: {
      surface: '#F2FAF2',
      ink: '#0C1C0C',
      accent: '#00A848',
      contrast: 50,
      diffAdded: '#18884A',
      diffRemoved: '#B03030',
      skill: '#2888B0',
      sidebar: '#E8F4E8',
      codeBg: '#E0EEE0',
    },
    accents: ['#00E870', '#00A848'],
  }),

  // ── Homebase ───────────────────────────────────────────────────────
  // Warm amber/wood tones. Cozy home feel. Unlocked by adding to home screen.
  createDexTheme({
    id: 'homebase',
    name: 'Homebase',
    copies: 0,
    _summary: 'Warm amber wood, soft evening light, and the comfort of being back home.',
    dark: {
      surface: '#14100A',
      ink: '#F0E8D8',
      accent: '#E0A040',
      contrast: 64,
      diffAdded: '#50C078',
      diffRemoved: '#E06048',
      skill: '#C898E0',
      sidebar: '#100C06',
      codeBg: '#0D0A04',
    },
    light: {
      surface: '#FAF6F0',
      ink: '#2C2418',
      accent: '#B87818',
      contrast: 48,
      diffAdded: '#1D8840',
      diffRemoved: '#B84028',
      skill: '#8860B8',
      sidebar: '#F2EEE4',
      codeBg: '#EAE6DA',
    },
    accents: ['#E0A040', '#B87818'],
  }),

  // ── Yin & Yang ─────────────────────────────────────────────────────
  // Pure duality. Dark is deep black with white accents, light is pure white
  // with black accents. Unlocked by submitting a theme with both variants.
  createDexTheme({
    id: 'yin-yang',
    name: 'Yin & Yang',
    copies: 0,
    _summary: 'Pure black and white duality balanced into a calm, minimal pair.',
    dark: {
      surface: '#0A0A0A',
      ink: '#F0F0F0',
      accent: '#FFFFFF',
      contrast: 70,
      diffAdded: '#48D080',
      diffRemoved: '#E85050',
      skill: '#B0B0B0',
      sidebar: '#050505',
      codeBg: '#030303',
    },
    light: {
      surface: '#FAFAFA',
      ink: '#0A0A0A',
      accent: '#000000',
      contrast: 50,
      diffAdded: '#1A8848',
      diffRemoved: '#B82828',
      skill: '#505050',
      sidebar: '#F0F0F0',
      codeBg: '#E8E8E8',
    },
    accents: ['#FFFFFF', '#000000'],
  }),

  // ── Easter Egg ────────────────────────────────────────────────────
  // Hidden window-controls surprise theme. Unlocked by discovering the close,
  // minimize, maximize, and chat-send interactions while signed in.
  createDexTheme({
    id: 'triple-dot',
    name: 'Easter Egg',
    copies: 0,
    _summary: 'Smoked glass chrome and candy-button accents for people who click everything.',
    _hiddenUntilUnlocked: true,
    dark: {
      surface: '#0C0E12',
      ink: '#EEF2F9',
      accent: '#FF6B6B',
      contrast: 66,
      diffAdded: '#4DD488',
      diffRemoved: '#FF6B6B',
      skill: '#8AB4FF',
      sidebar: '#090B0E',
      codeBg: '#06080B',
    },
    light: {
      surface: '#F7F7FB',
      ink: '#1F2230',
      accent: '#E05252',
      contrast: 49,
      diffAdded: '#1F9C56',
      diffRemoved: '#C73A3A',
      skill: '#5679F0',
      sidebar: '#ECECF4',
      codeBg: '#E6E7EF',
    },
    accents: ['#FF6B6B', '#F7C948', '#4DD488', '#6FA8FF'],
  }),
]);
