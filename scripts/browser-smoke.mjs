import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const host = '127.0.0.1';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function contentTypeFor(filePath) {
  return MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
}

async function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  if (cleanPath === '/' || cleanPath === '') return path.join(root, 'index.html');
  const absolute = path.join(root, cleanPath.replace(/^\/+/, ''));
  const fileInfo = await stat(absolute).catch(() => null);
  if (fileInfo?.isFile()) return absolute;
  return null;
}

async function startStaticServer() {
  const server = http.createServer(async (req, res) => {
    const filePath = await resolveRequestPath(req.url || '/');
    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
    createReadStream(filePath).pipe(res);
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, host, resolve);
  });

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4173;
  return {
    baseUrl: `http://${host}:${port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

async function runTest(name, fn) {
  await fn();
  process.stdout.write(`ok - ${name}\n`);
}

async function dismissWelcomeIfPresent(page) {
  const dismiss = page.locator('.welcome-dismiss-btn').first();
  if (await dismiss.count()) {
    await dismiss.click().catch(() => {});
  }
}

async function bootDesktopPage(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('#preview-window');
  await dismissWelcomeIfPresent(page);
  return page;
}

async function bootDesktopPageAt(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#preview-window');
  await dismissWelcomeIfPresent(page);
  return page;
}

async function bootMobilePage(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('#mobile-nav');
  await dismissWelcomeIfPresent(page);
  return page;
}

const server = await startStaticServer();
const browser = await chromium.launch({ headless: true });

try {
  await runTest('desktop browse renders the Codex shell', async () => {
    const page = await bootDesktopPage(browser, server.baseUrl);
    const title = await page.locator('#preview-theme-name').textContent();
    assert.ok(title?.trim().length, 'expected a preview title');
    await page.close();
  });

  await runTest('desktop variant switching updates the selected card', async () => {
    const page = await bootDesktopPage(browser, server.baseUrl);
    await page.click('#card-light');
    await page.waitForFunction(() => document.getElementById('card-light')?.getAttribute('aria-pressed') === 'true');
    const applyText = await page.locator('.apply-codex-btn').first().textContent();
    assert.match(applyText || '', /Apply in Codex/);
    await page.close();
  });

  await runTest('desktop builder flow opens and edits a theme name', async () => {
    const page = await bootDesktopPage(browser, server.baseUrl);
    await page.click('#submit-btn');
    await page.waitForSelector('.builder-panel');
    await page.fill('#builder-name', 'Smoke Theme');
    const value = await page.locator('#builder-name').inputValue();
    assert.equal(value, 'Smoke Theme');
    await page.close();
  });

  await runTest('desktop locked theme selection shows the locked shell', async () => {
    const page = await bootDesktopPage(browser, server.baseUrl);
    await page.fill('#sidebar-search', 'Patron');
    await page.waitForSelector('[data-theme-id="patron"]');
    await page.click('[data-theme-id="patron"]');
    await page.waitForSelector('.locked-theme-shell-card');
    const lockedTitle = await page.locator('.locked-theme-shell-title').textContent();
    assert.match(lockedTitle || '', /Patron/i);
    await page.close();
  });

  await runTest('desktop signed-out like action shows a sign-in prompt', async () => {
    const page = await bootDesktopPage(browser, server.baseUrl);
    await page.click('#like-btn');
    await page.waitForSelector('.like-signin-prompt');
    const promptBody = await page.locator('.like-signin-prompt .assistant-inline-body').textContent();
    assert.match(promptBody || '', /like this theme/i);
    await page.close();
  });

  await runTest('desktop query boot honors the requested variant without breaking shell startup', async () => {
    const page = await bootDesktopPageAt(browser, `${server.baseUrl}/?theme=solarized&variant=light`);
    await page.waitForFunction(() => document.getElementById('card-light')?.getAttribute('aria-pressed') === 'true');
    const url = page.url();
    assert.equal(new URL(url).search, '');
    await page.close();
  });

  await runTest('compact viewport boots into mobile browse mode', async () => {
    const page = await bootMobilePage(browser, server.baseUrl);
    await page.waitForSelector('.mobile-cat-pills');
    const activeNav = await page.locator('.mobile-nav-btn.active').textContent();
    assert.match(activeNav || '', /Browse/i);
    await page.close();
  });

  await runTest('compact viewport can open preview from a theme selection', async () => {
    const page = await bootMobilePage(browser, server.baseUrl);
    await page.locator('.theme-card').first().click();
    await page.waitForSelector('.panel.mobile-active');
    await page.close();
  });

  await runTest('compact viewport can open the create flow from mobile nav', async () => {
    const page = await bootMobilePage(browser, server.baseUrl);
    await page.click('.mobile-nav-btn[data-view="create"]');
    await page.waitForSelector('.builder-panel');
    const applyText = await page.locator('.builder-apply-btn .builder-apply-btn-text').textContent();
    assert.match(applyText || '', /Copy Theme|Apply in Codex/);
    await page.close();
  });

  await runTest('compact create flow shows the one-time builder sign-in prompt after editing', async () => {
    const page = await bootMobilePage(browser, server.baseUrl);
    await page.click('.mobile-nav-btn[data-view="create"]');
    await page.waitForSelector('.builder-panel');
    await page.fill('#builder-name', 'Pocket Theme');
    await page.waitForSelector('.builder-signin-prompt');
    const promptBody = await page.locator('.builder-signin-prompt .assistant-inline-body').textContent();
    assert.match(promptBody || '', /copy this theme without an account/i);
    await page.close();
  });
} finally {
  await browser.close();
  await server.close();
}
