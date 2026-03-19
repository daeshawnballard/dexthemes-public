// src/config.js
var DIRECT_CONVEX_SITE_URL = window.__CONVEX_SITE_URL || "https://acrobatic-corgi-867.convex.site";
function isLocalRuntime() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}
var CONVEX_SITE_URL = isLocalRuntime() ? DIRECT_CONVEX_SITE_URL : "";

// src/theme-catalog.js
var DARK_DEFAULTS = { diffAdded: "#40c977", diffRemoved: "#fa423e", skill: "#ad7bf9" };
var LIGHT_DEFAULTS = { diffAdded: "#00a240", diffRemoved: "#ba2623", skill: "#924ff7" };
var DEXTHEMES_GROUP_LABELS = window.DEXTHEMES_GROUP_LABELS || {
  anime: "Anime",
  games: "Video Games",
  movies: "Movies",
  comics: "Comics",
  zodiacs: "Zodiacs",
  lunar: "Lunar Animals",
  companies: "Companies",
  originals: "Originals"
};
var THEMES = [
  // ==============================
  // OFFICIAL CODEX THEMES
  // ==============================
  {
    id: "codex",
    name: "Codex",
    category: "official",
    codeThemeId: "codex",
    copies: 482,
    dateAdded: "2025-05-01",
    dark: { surface: "#111111", ink: "#fcfcfc", accent: "#0169cc", contrast: 60, diffAdded: "#00a240", diffRemoved: "#e02e2a", skill: "#B06DFF", sidebar: "#0a0a0a", codeBg: "#080808" },
    light: { surface: "#ffffff", ink: "#0d0d0d", accent: "#0169cc", contrast: 45, diffAdded: "#00a240", diffRemoved: "#e02e2a", skill: "#751ED9", sidebar: "#f5f5f5", codeBg: "#f0f0f0" },
    accents: ["#0169cc"]
  },
  {
    id: "absolutely",
    name: "Absolutely",
    category: "official",
    codeThemeId: "absolutely",
    copies: 127,
    dateAdded: "2025-05-01",
    dark: { surface: "#2d2d2b", ink: "#f9f9f7", accent: "#cc7d5e", contrast: 60, ...DARK_DEFAULTS, sidebar: "#242422", codeBg: "#222220" },
    light: { surface: "#f9f9f7", ink: "#2d2d2b", accent: "#cc7d5e", contrast: 45, ...LIGHT_DEFAULTS, sidebar: "#f0f0ee", codeBg: "#ededed" },
    accents: ["#cc7d5e"]
  },
  {
    id: "ayu",
    name: "Ayu",
    category: "official",
    codeThemeId: "ayu",
    variants: ["dark"],
    copies: 203,
    dateAdded: "2025-05-01",
    dark: { surface: "#0b0e14", ink: "#bfbdb6", accent: "#e6b450", contrast: 60, diffAdded: "#7fd962", diffRemoved: "#ea6c73", skill: "#cda1fa", sidebar: "#070a0f", codeBg: "#060810" },
    accents: ["#e6b450"]
  },
  {
    id: "catppuccin",
    name: "Catppuccin",
    category: "official",
    codeThemeId: "catppuccin",
    copies: 389,
    dateAdded: "2025-05-01",
    dark: { surface: "#1e1e2e", ink: "#cdd6f4", accent: "#cba6f7", contrast: 60, diffAdded: "#a6e3a1", diffRemoved: "#f38ba8", skill: "#cba6f7", sidebar: "#181825", codeBg: "#14141f" },
    light: { surface: "#eff1f5", ink: "#4c4f69", accent: "#8839ef", contrast: 45, diffAdded: "#40a02b", diffRemoved: "#d20f39", skill: "#8839ef", sidebar: "#e6e9ef", codeBg: "#dce0e8" },
    accents: ["#cba6f7", "#8839ef"]
  },
  {
    id: "dracula",
    name: "Dracula",
    category: "official",
    codeThemeId: "dracula",
    variants: ["dark"],
    copies: 341,
    dateAdded: "2025-05-01",
    dark: { surface: "#282A36", ink: "#F8F8F2", accent: "#FF79C6", contrast: 60, diffAdded: "#50FA7B", diffRemoved: "#FF5555", skill: "#FF79C6", sidebar: "#21222C", codeBg: "#1d1e28" },
    accents: ["#FF79C6"]
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    category: "official",
    codeThemeId: "github-dark-default",
    variants: ["dark"],
    copies: 256,
    dateAdded: "2025-05-01",
    dark: { surface: "#0d1117", ink: "#e6edf3", accent: "#58a6ff", contrast: 60, diffAdded: "#3fb950", diffRemoved: "#f85149", skill: "#bc8cff", sidebar: "#090c10", codeBg: "#070a0f" },
    accents: ["#58a6ff"]
  },
  {
    id: "github-light",
    name: "GitHub Light",
    category: "official",
    codeThemeId: "github-light-default",
    variants: ["light"],
    copies: 178,
    dateAdded: "2025-05-01",
    light: { surface: "#ffffff", ink: "#1f2328", accent: "#0969da", contrast: 45, diffAdded: "#1a7f37", diffRemoved: "#cf222e", skill: "#8250df", sidebar: "#f6f8fa", codeBg: "#f0f2f4" },
    accents: ["#0969da"]
  },
  {
    id: "gruvbox",
    name: "Gruvbox",
    category: "official",
    codeThemeId: "gruvbox-dark-hard",
    variants: ["dark"],
    copies: 194,
    dateAdded: "2025-05-01",
    dark: { surface: "#1d2021", ink: "#ebdbb2", accent: "#fe8019", contrast: 60, diffAdded: "#b8bb26", diffRemoved: "#fb4934", skill: "#d3869b", sidebar: "#171819", codeBg: "#131415" },
    accents: ["#fe8019"]
  },
  {
    id: "monokai",
    name: "Monokai",
    category: "official",
    codeThemeId: "monokai",
    variants: ["dark"],
    copies: 287,
    dateAdded: "2025-05-01",
    dark: { surface: "#272822", ink: "#F8F8F2", accent: "#F92672", contrast: 60, diffAdded: "#A6E22E", diffRemoved: "#F92672", skill: "#AE81FF", sidebar: "#1f201b", codeBg: "#1b1c17" },
    accents: ["#F92672", "#A6E22E", "#66D9EF"]
  },
  {
    id: "nord",
    name: "Nord",
    category: "official",
    codeThemeId: "nord",
    variants: ["dark"],
    copies: 231,
    dateAdded: "2025-05-01",
    dark: { surface: "#2E3440", ink: "#ECEFF4", accent: "#88C0D0", contrast: 60, diffAdded: "#A3BE8C", diffRemoved: "#BF616A", skill: "#B48EAD", sidebar: "#272c36", codeBg: "#242830" },
    accents: ["#88C0D0"]
  },
  {
    id: "one-dark",
    name: "One Dark",
    category: "official",
    codeThemeId: "one-dark-pro",
    variants: ["dark"],
    copies: 312,
    dateAdded: "2025-05-01",
    dark: { surface: "#282c34", ink: "#abb2bf", accent: "#61afef", contrast: 60, diffAdded: "#98c379", diffRemoved: "#e06c75", skill: "#c678dd", sidebar: "#21252b", codeBg: "#1d2025" },
    accents: ["#61afef"]
  },
  {
    id: "rose-pine",
    name: "Ros\xE9 Pine",
    category: "official",
    codeThemeId: "rose-pine",
    variants: ["dark"],
    copies: 168,
    dateAdded: "2025-05-01",
    dark: { surface: "#191724", ink: "#e0def4", accent: "#c4a7e7", contrast: 60, diffAdded: "#9ccfd8", diffRemoved: "#eb6f92", skill: "#c4a7e7", sidebar: "#13111e", codeBg: "#100e19" },
    accents: ["#c4a7e7", "#ebbcba"]
  },
  {
    id: "solarized",
    name: "Solarized",
    category: "official",
    codeThemeId: "solarized",
    copies: 267,
    dateAdded: "2025-05-01",
    dark: { surface: "#002b36", ink: "#839496", accent: "#268bd2", contrast: 60, diffAdded: "#859900", diffRemoved: "#dc322f", skill: "#6c71c4", sidebar: "#00222b", codeBg: "#001e26" },
    light: { surface: "#fdf6e3", ink: "#657b83", accent: "#268bd2", contrast: 45, diffAdded: "#859900", diffRemoved: "#dc322f", skill: "#6c71c4", sidebar: "#f5eedb", codeBg: "#eee8d5" },
    accents: ["#268bd2"]
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    category: "official",
    codeThemeId: "tokyo-night",
    variants: ["dark"],
    copies: 298,
    dateAdded: "2025-05-01",
    dark: { surface: "#1a1b26", ink: "#c0caf5", accent: "#7aa2f7", contrast: 60, diffAdded: "#9ece6a", diffRemoved: "#f7768e", skill: "#bb9af7", sidebar: "#13141d", codeBg: "#101018" },
    accents: ["#7aa2f7"]
  },
  {
    id: "vscode-plus",
    name: "VS Code+",
    category: "official",
    codeThemeId: "codex",
    copies: 223,
    dateAdded: "2025-05-01",
    dark: { surface: "#1E1E1E", ink: "#D4D4D4", accent: "#007ACC", contrast: 60, ...DARK_DEFAULTS, sidebar: "#171717", codeBg: "#131313" },
    light: { surface: "#FFFFFF", ink: "#000000", accent: "#007ACC", contrast: 45, ...LIGHT_DEFAULTS, sidebar: "#f3f3f3", codeBg: "#ececec" },
    accents: ["#007ACC"]
  },
  // ==============================
  // DEXTHEMES (loaded from theme-data/dexthemes/*)
  // ==============================
  ...Object.values(window.DEXTHEMES_PACKS && window.DEXTHEMES_PACKS.dexthemes || {}).flat()
  // ==============================
  // COMMUNITY THEMES
  // ==============================
];
var CATEGORIES = [
  { id: "official", name: "Codex", icon: "shield" },
  {
    id: "dexthemes",
    name: "DexThemes",
    icon: "palette",
    groups: ["anime", "games", "movies", "comics", "zodiacs", "lunar", "companies", "originals", "supporter"]
  },
  { id: "community", name: "Community", icon: "users" }
];

// src/preview-examples.js
var EXAMPLES = [
  {
    user: "Spawn a subagent to fix lint errors",
    intro: "Here\u2019s how to spawn a Codex subagent for automated lint fixing:",
    comment: "// agents/lintFixer.ts",
    code: [
      { type: "kw", text: "import" },
      " { ",
      { type: "fn", text: "CodexAgent" },
      " } ",
      { type: "kw", text: "from" },
      " ",
      { type: "str", text: "'@openai/codex'" },
      ";\n",
      "\n",
      { type: "kw", text: "const" },
      " agent = ",
      { type: "kw", text: "new" },
      " ",
      { type: "fn", text: "CodexAgent" },
      "({\n",
      "  model: ",
      { type: "str", text: "'codex-1'" },
      ",\n",
      "  sandbox: ",
      { type: "kw", text: "true" },
      ",\n",
      "  allowNet: ",
      { type: "kw", text: "false" },
      ",\n",
      "});\n",
      "\n",
      { type: "kw", text: "const" },
      " result = ",
      { type: "kw", text: "await" },
      " agent.",
      { type: "fn", text: "run" },
      "({\n",
      "  task: ",
      { type: "str", text: "'Fix all ESLint errors in src/'" },
      ",\n",
      "  workDir: ",
      { type: "str", text: "'./project'" },
      ",\n",
      "});\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(result.diff);"
    ],
    followUp: "Now run the test suite against the patched files"
  },
  {
    user: "Fetch themes from the DexThemes API",
    intro: "Here\u2019s how to pull themes and apply one programmatically:",
    comment: "// scripts/fetchThemes.ts",
    code: [
      { type: "kw", text: "const" },
      " res = ",
      { type: "kw", text: "await" },
      " ",
      { type: "fn", text: "fetch" },
      "(\n",
      "  ",
      { type: "str", text: "'https://dexthemes.com/api/themes'" },
      "\n",
      ");\n",
      { type: "kw", text: "const" },
      " payload = ",
      { type: "kw", text: "await" },
      " res.",
      { type: "fn", text: "json" },
      "();\n",
      { type: "kw", text: "const" },
      " themes = payload.themes;\n",
      "\n",
      { type: "kw", text: "const" },
      " top = themes.",
      { type: "fn", text: "sort" },
      "(\n",
      "  (a, b) => b.copies - a.copies\n",
      ")[0];\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(",
      { type: "str", text: "'Top theme:'" },
      ", top.name);\n",
      { type: "fn", text: "console.log" },
      "(",
      { type: "str", text: "'Accent:'" },
      ", top.dark?.accent);"
    ],
    followUp: "Apply this theme to my Codex config"
  },
  {
    user: "Stream a database migration with Codex",
    intro: "Here\u2019s a streaming migration using the Codex responses API:",
    comment: "// migrations/streamMigrate.ts",
    code: [
      { type: "kw", text: "import" },
      " ",
      { type: "fn", text: "OpenAI" },
      " ",
      { type: "kw", text: "from" },
      " ",
      { type: "str", text: "'openai'" },
      ";\n",
      "\n",
      { type: "kw", text: "const" },
      " client = ",
      { type: "kw", text: "new" },
      " ",
      { type: "fn", text: "OpenAI" },
      "();\n",
      { type: "kw", text: "const" },
      " stream = ",
      { type: "kw", text: "await" },
      " client.responses.",
      { type: "fn", text: "create" },
      "({\n",
      "  model: ",
      { type: "str", text: "'codex-1'" },
      ",\n",
      "  stream: ",
      { type: "kw", text: "true" },
      ",\n",
      "  input: ",
      { type: "str", text: "'Migrate users table to v2 schema'" },
      ",\n",
      "});\n",
      "\n",
      { type: "kw", text: "for await" },
      " (",
      { type: "kw", text: "const" },
      " event ",
      { type: "kw", text: "of" },
      " stream) {\n",
      "  ",
      { type: "fn", text: "process.stdout.write" },
      "(event.delta ?? ",
      { type: "str", text: "''" },
      ");\n",
      "}"
    ],
    followUp: "Add a rollback step if the migration fails"
  },
  {
    user: "Submit a theme to DexThemes from the CLI",
    intro: "Here\u2019s how to submit a custom theme via the API:",
    comment: "// scripts/submitTheme.ts",
    code: [
      { type: "kw", text: "const" },
      " theme = {\n",
      "  themeId: ",
      { type: "str", text: "'midnight-bloom'" },
      ",\n",
      "  name: ",
      { type: "str", text: "'Midnight Bloom'" },
      ",\n",
      "  summary: ",
      { type: "str", text: "'Deep purple garden at night'" },
      ",\n",
      "  dark: {\n",
      "    surface: ",
      { type: "str", text: "'#1a0e2e'" },
      ", ink: ",
      { type: "str", text: "'#e8dff5'" },
      ",\n",
      "    accent: ",
      { type: "str", text: "'#b388ff'" },
      ", contrast: 60,\n",
      "    diffAdded: ",
      { type: "str", text: "'#69f0ae'" },
      ",\n",
      "    diffRemoved: ",
      { type: "str", text: "'#ff5252'" },
      ",\n",
      "    skill: ",
      { type: "str", text: "'#ea80fc'" },
      ",\n",
      "  },\n",
      "  accents: [",
      { type: "str", text: "'#b388ff'" },
      "],\n",
      "};\n",
      "\n",
      { type: "kw", text: "await" },
      " ",
      { type: "fn", text: "fetch" },
      "(url, {\n",
      "  method: ",
      { type: "str", text: "'POST'" },
      ",\n",
      "  headers: { Authorization: ",
      { type: "str", text: "'Bearer '" },
      " + token },\n",
      "  body: JSON.",
      { type: "fn", text: "stringify" },
      "(theme),\n",
      "});"
    ],
    followUp: "Generate the import string for Codex settings"
  },
  {
    user: "Run a code review on my latest PR",
    intro: "Here\u2019s how to use Codex for automated code review:",
    comment: "// tools/codeReview.ts",
    code: [
      { type: "kw", text: "import" },
      " ",
      { type: "fn", text: "OpenAI" },
      " ",
      { type: "kw", text: "from" },
      " ",
      { type: "str", text: "'openai'" },
      ";\n",
      "\n",
      { type: "kw", text: "const" },
      " client = ",
      { type: "kw", text: "new" },
      " ",
      { type: "fn", text: "OpenAI" },
      "();\n",
      { type: "kw", text: "const" },
      " review = ",
      { type: "kw", text: "await" },
      " client.responses.",
      { type: "fn", text: "create" },
      "({\n",
      "  model: ",
      { type: "str", text: "'codex-1'" },
      ",\n",
      "  input: ",
      { type: "str", text: "'Review PR #42 for bugs and style issues'" },
      ",\n",
      "  tools: [{ type: ",
      { type: "str", text: "'file_search'" },
      " }],\n",
      "});\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(review.output_text);"
    ],
    followUp: "Now auto-fix the issues it found"
  },
  {
    user: "Browse trending DexThemes this week",
    intro: "Here\u2019s how to fetch trending themes with the DexThemes API:",
    comment: "// scripts/trending.ts",
    code: [
      { type: "kw", text: "const" },
      " res = ",
      { type: "kw", text: "await" },
      " ",
      { type: "fn", text: "fetch" },
      "(\n",
      "  ",
      { type: "str", text: "'https://dexthemes.com/api/themes'" },
      "\n",
      ");\n",
      { type: "kw", text: "const" },
      " payload = ",
      { type: "kw", text: "await" },
      " res.",
      { type: "fn", text: "json" },
      "();\n",
      { type: "kw", text: "const" },
      " themes = payload.themes;\n",
      "\n",
      { type: "kw", text: "const" },
      " trending = themes\n",
      "  .",
      { type: "fn", text: "filter" },
      "(t => t.likes > 5)\n",
      "  .",
      { type: "fn", text: "sort" },
      "((a, b) => b.likes - a.likes)\n",
      "  .",
      { type: "fn", text: "slice" },
      "(0, 10);\n",
      "\n",
      "trending.",
      { type: "fn", text: "forEach" },
      "(t =>\n",
      "  ",
      { type: "fn", text: "console.log" },
      "(",
      { type: "str", text: "`${t.name}: ${t.likes} likes`" },
      ")\n",
      ");"
    ],
    followUp: "Apply the top one to my Codex config"
  },
  {
    user: "Generate unit tests for my auth module",
    intro: "Here\u2019s how to use Codex to generate tests automatically:",
    comment: "// scripts/genTests.ts",
    code: [
      { type: "kw", text: "import" },
      " { ",
      { type: "fn", text: "CodexAgent" },
      " } ",
      { type: "kw", text: "from" },
      " ",
      { type: "str", text: "'@openai/codex'" },
      ";\n",
      "\n",
      { type: "kw", text: "const" },
      " agent = ",
      { type: "kw", text: "new" },
      " ",
      { type: "fn", text: "CodexAgent" },
      "({\n",
      "  model: ",
      { type: "str", text: "'codex-1'" },
      ",\n",
      "  sandbox: ",
      { type: "kw", text: "true" },
      ",\n",
      "});\n",
      "\n",
      { type: "kw", text: "const" },
      " result = ",
      { type: "kw", text: "await" },
      " agent.",
      { type: "fn", text: "run" },
      "({\n",
      "  task: ",
      { type: "str", text: "'Write tests for src/auth.ts'" },
      ",\n",
      "  workDir: ",
      { type: "str", text: "'./project'" },
      ",\n",
      "});\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(result.files);"
    ],
    followUp: "Run the tests and show me the coverage report"
  },
  {
    user: "Like a theme on DexThemes programmatically",
    intro: "Here\u2019s how to like a community theme via the API:",
    comment: "// scripts/likeTheme.ts",
    code: [
      { type: "kw", text: "const" },
      " themeId = ",
      { type: "str", text: "'midnight-bloom'" },
      ";\n",
      "\n",
      { type: "kw", text: "const" },
      " res = ",
      { type: "kw", text: "await" },
      " ",
      { type: "fn", text: "fetch" },
      "(\n",
      "  ",
      { type: "str", text: "`https://dexthemes.com/themes/like`" },
      ",\n",
      "  {\n",
      "    method: ",
      { type: "str", text: "'POST'" },
      ",\n",
      "    headers: {\n",
      "      Authorization: ",
      { type: "str", text: "'Bearer '" },
      " + token,\n",
      "      ",
      { type: "str", text: "'Content-Type'" },
      ": ",
      { type: "str", text: "'application/json'" },
      ",\n",
      "    },\n",
      "    body: JSON.",
      { type: "fn", text: "stringify" },
      "({ themeId }),\n",
      "  }\n",
      ");\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(",
      { type: "str", text: "'Liked!'" },
      ", ",
      { type: "kw", text: "await" },
      " res.",
      { type: "fn", text: "json" },
      "());"
    ],
    followUp: "Show me my total likes across all themes"
  },
  {
    user: "Refactor this file to use async/await",
    intro: "Here\u2019s a Codex call to refactor callback-heavy code:",
    comment: "// tools/refactor.ts",
    code: [
      { type: "kw", text: "import" },
      " ",
      { type: "fn", text: "OpenAI" },
      " ",
      { type: "kw", text: "from" },
      " ",
      { type: "str", text: "'openai'" },
      ";\n",
      { type: "kw", text: "import" },
      " { ",
      { type: "fn", text: "readFileSync" },
      " } ",
      { type: "kw", text: "from" },
      " ",
      { type: "str", text: "'fs'" },
      ";\n",
      "\n",
      { type: "kw", text: "const" },
      " code = ",
      { type: "fn", text: "readFileSync" },
      "(",
      { type: "str", text: "'src/api.js'" },
      ", ",
      { type: "str", text: "'utf-8'" },
      ");\n",
      { type: "kw", text: "const" },
      " client = ",
      { type: "kw", text: "new" },
      " ",
      { type: "fn", text: "OpenAI" },
      "();\n",
      "\n",
      { type: "kw", text: "const" },
      " res = ",
      { type: "kw", text: "await" },
      " client.responses.",
      { type: "fn", text: "create" },
      "({\n",
      "  model: ",
      { type: "str", text: "'codex-1'" },
      ",\n",
      "  input: ",
      { type: "str", text: "'Convert to async/await:\\n'" },
      " + code,\n",
      "});\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(res.output_text);"
    ],
    followUp: "Write the refactored code back to the file"
  },
  {
    user: "Get the import string for a DexTheme",
    intro: "Here\u2019s how to generate a Codex import string from a theme:",
    comment: "// scripts/importString.ts",
    code: [
      { type: "kw", text: "const" },
      " res = ",
      { type: "kw", text: "await" },
      " ",
      { type: "fn", text: "fetch" },
      "(\n",
      "  ",
      { type: "str", text: "'https://dexthemes.com/api/themes'" },
      "\n",
      ");\n",
      { type: "kw", text: "const" },
      " payload = ",
      { type: "kw", text: "await" },
      " res.",
      { type: "fn", text: "json" },
      "();\n",
      { type: "kw", text: "const" },
      " themes = payload.themes;\n",
      { type: "kw", text: "const" },
      " theme = themes.",
      { type: "fn", text: "find" },
      "(\n",
      "  t => t.id === ",
      { type: "str", text: "'midnight-bloom'" },
      "\n",
      ");\n",
      "\n",
      { type: "kw", text: "const" },
      " importStr = ",
      { type: "str", text: "'codex-theme-v1:'" },
      "\n",
      "  + JSON.",
      { type: "fn", text: "stringify" },
      "({\n",
      "    theme: theme.dark,\n",
      "    variant: ",
      { type: "str", text: "'dark'" },
      ",\n",
      "  });\n",
      "\n",
      { type: "fn", text: "console.log" },
      "(importStr);"
    ],
    followUp: "Paste that into my Codex settings"
  }
];

// src/unlocks.js
var UNLOCK_THEMES = {
  buy_coffee: { themeId: "patron", name: "Patron", description: "Opulent gold and warm marble for a quiet, supporter-only lounge.", prompt: "Buy a coffee to unlock", link: "https://buymeacoffee.com/daeshawn" },
  create_theme: { themeId: "seraphim", name: "Seraphim", description: "Celestial blue light and cathedral calm with a soft, angelic glow.", prompt: "Create your first theme to unlock", deeplink: "create" },
  share_x: { themeId: "mint-condition", name: "Mint Condition", description: "Vault greens and crisp paper whites with polished prosperity energy.", prompt: "Share a theme on X to unlock", deeplink: "share" },
  sign_in: { themeId: "cupids-code", name: "Cupid's Code", description: "Romantic rose warmth and velvet reds written like a love letter.", prompt: "Sign in to unlock", deeplink: "signin" },
  like_theme: { themeId: "heartbeat", name: "Heartbeat", description: "A pulsing cherry red palette with bright warmth and steady momentum.", prompt: "Like a theme to unlock", deeplink: "like" },
  top10_monthly: { themeId: "summit", name: "Summit", description: "Alpine slate and gold peak accents for a sharp, high-altitude focus.", prompt: "Reach the Top 10 this month to unlock", deeplink: "leaderboard" },
  use_api: { themeId: "the-builder", name: "The Builder", description: "Dark steel and workshop orange with the energy of making something real.", prompt: "Make an API call to unlock", deeplink: "api" },
  color_me_lucky: { themeId: "kaleidoscope", name: "Kaleidoscope", description: "A prismatic burst of neon color that turns every pane into confetti.", prompt: "Use Color Me Lucky to unlock", deeplink: "lucky" },
  agent_use: { themeId: "agent-claw", name: "Agent Claw", description: "Circuit-board greens and luminous traces for a tool-built, agentic feel.", prompt: "Register an AI agent to unlock", deeplink: "agent" },
  install_pwa: { themeId: "homebase", name: "Homebase", description: "Warm amber wood, soft evening light, and the comfort of being back home.", prompt: "Add to your home screen to unlock", deeplink: "install" },
  complete_pair: { themeId: "yin-yang", name: "Yin & Yang", description: "Pure black and white duality balanced into a calm, minimal pair.", prompt: "Submit a theme with both dark & light variants to unlock", deeplink: "pair" }
};
var THEME_ID_TO_ACTION = Object.fromEntries(
  Object.entries(UNLOCK_THEMES).map(([action, value]) => [value.themeId, action])
);
var SUPPORTER_THEME_IDS = Object.values(UNLOCK_THEMES).map((value) => value.themeId);
var SUPPORTER_THEME_ID = UNLOCK_THEMES.buy_coffee.themeId;
function getUnlockActionForThemeId(themeId) {
  return THEME_ID_TO_ACTION[themeId] || null;
}
function isThemeLockedForUser(themeId, unlockedThemeIds) {
  const action = getUnlockActionForThemeId(themeId);
  if (!action) return false;
  return !unlockedThemeIds.has(themeId);
}

// src/app-state.js
var _urlParams = new URLSearchParams(window.location.search);
var _urlThemeId = _urlParams.get("theme");
var _urlVariant = _urlParams.get("variant");
var _savedThemeId = _urlThemeId || localStorage.getItem("dexthemes-selected");
var selectedTheme = _savedThemeId && THEMES.find((theme) => theme.id === _savedThemeId) || THEMES[0];
var selectedVariant = _urlVariant || localStorage.getItem("dexthemes-variant") || "dark";
var isDeepLink = !!_urlThemeId;
if (_urlThemeId) {
  try {
    history.replaceState(null, "", window.location.pathname);
  } catch (e) {
  }
}
var selectedAccentIdx = 0;
var expandedCategories = { official: false, dexthemes: false, community: false };
var expandedSubgroups = {
  official: {},
  dexthemes: {
    anime: false,
    games: false,
    movies: false,
    comics: false,
    zodiacs: false,
    lunar: false,
    companies: false,
    originals: false,
    supporter: false
  },
  community: {}
};
var pinnedSubgroups = {
  official: {},
  dexthemes: {},
  community: {}
};
var currentExampleIdx = Math.floor(Math.random() * 4);
var windowState = "normal";
var activeFilter = "all";
var activeSort = "default";
var panelMode = "preview";
var builderColors = null;
var openDropdown = null;
var leaderboardVisible = false;
var profileVisible = false;
var userUnlocks = /* @__PURE__ */ new Set();
var currentUser = null;
var flaggedThemes = /* @__PURE__ */ new Set();
function setUserUnlocks(unlocks) {
  userUnlocks = unlocks;
}
function isCurrentUserSupporter() {
  return userUnlocks.has(SUPPORTER_THEME_ID);
}
function setSelectedTheme(theme) {
  selectedTheme = theme;
  try {
    localStorage.setItem("dexthemes-selected", theme.id);
    localStorage.setItem("dexthemes-theme-cache", JSON.stringify({
      dark: theme.dark || null,
      light: theme.light || null,
      accents: theme.accents || []
    }));
  } catch {
  }
}
function setSelectedVariant(variant) {
  selectedVariant = variant;
  try {
    localStorage.setItem("dexthemes-variant", variant);
  } catch {
  }
}
function setSelectedAccentIdx(index) {
  selectedAccentIdx = index;
}
function setCurrentExampleIdx(index) {
  currentExampleIdx = index;
}
function setWindowState(nextState) {
  windowState = nextState;
}
function setActiveFilter(filter) {
  activeFilter = filter;
}
function setActiveSort(sort) {
  activeSort = sort;
}
function setPanelMode(mode) {
  panelMode = mode;
}
function setBuilderColors(colors) {
  builderColors = colors;
}
function setOpenDropdown(dropdown) {
  openDropdown = dropdown;
}
function setLeaderboardVisible(value) {
  leaderboardVisible = value;
}
function setProfileVisible(value) {
  profileVisible = value;
}
function setCurrentUser(user) {
  currentUser = user;
}

export {
  CONVEX_SITE_URL,
  DEXTHEMES_GROUP_LABELS,
  THEMES,
  CATEGORIES,
  EXAMPLES,
  UNLOCK_THEMES,
  THEME_ID_TO_ACTION,
  SUPPORTER_THEME_IDS,
  getUnlockActionForThemeId,
  isThemeLockedForUser,
  selectedTheme,
  selectedVariant,
  isDeepLink,
  selectedAccentIdx,
  expandedCategories,
  expandedSubgroups,
  pinnedSubgroups,
  currentExampleIdx,
  windowState,
  activeFilter,
  activeSort,
  panelMode,
  builderColors,
  openDropdown,
  leaderboardVisible,
  profileVisible,
  userUnlocks,
  currentUser,
  flaggedThemes,
  setUserUnlocks,
  isCurrentUserSupporter,
  setSelectedTheme,
  setSelectedVariant,
  setSelectedAccentIdx,
  setCurrentExampleIdx,
  setWindowState,
  setActiveFilter,
  setActiveSort,
  setPanelMode,
  setBuilderColors,
  setOpenDropdown,
  setLeaderboardVisible,
  setProfileVisible,
  setCurrentUser
};
