import {chromium} from 'playwright-core';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const root = process.cwd();
const dir = mkdtempSync(join(tmpdir(), 'proofdesk-ui-'));
const env = { ...process.env, PROOFDESK_SQLITE_PATH: join(dir, 'cases.db') };
const init = spawnSync(join(root, '.venv/bin/python'), ['-m', 'api', '--init-db'], { env, cwd: root });
if (init.status !== 0) throw Error('Database initialization failed');

const server = spawn(join(root, '.venv/bin/python'), ['-m', 'uvicorn', 'api:app', '--host', '127.0.0.1', '--port', '8767'], { env, cwd: root, stdio: 'ignore' });
let browser;

try {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch('http://127.0.0.1:8767/');
      if (r.ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (i === 79) throw Error('Server unavailable');
  }

  browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // 1. Initial Load at 1440px Desktop
  await page.goto('http://127.0.0.1:8767/');
  await page.getByRole('button', { name: 'Load illustrative example' }).click();
  await page.getByRole('button', { name: 'Build business case' }).click();
  await page.getByText('USD 65,000.00', { exact: true }).first().waitFor();
  await page.screenshot({ path: '/private/tmp/proofdesk-1440-desktop.png', fullPage: true });

  // 2. Save Case Action
  await page.getByRole('button', { name: 'Save case' }).click();
  await page.getByRole('button', { name: 'Saved ✓' }).waitFor();

  // 3. Export Actions (Spreadsheet, PDF, Word, CSV)
  for (const [name, ext] of [
    ['Spreadsheet', 'xlsx'],
    ['PDF', 'pdf'],
    ['Word', 'docx'],
    ['Download CSV', 'csv'],
  ]) {
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name, exact: true }).click();
    const file = await event;
    if (!file.suggestedFilename().endsWith('.' + ext)) {
      throw Error('Wrong export name: ' + name);
    }
  }

  // 4. Evidence Library Navigation & Modal Detail Inspection
  await page.getByRole('button', { name: 'Evidence library' }).click();
  await page.getByRole('heading', { name: 'Trace every claim.' }).waitFor();

  // Inspect an evidence card
  const evidenceCard = page.locator('.evidence-card').first();
  await evidenceCard.click();
  await page.getByText('Direct Source Excerpt').waitFor();
  await page.getByRole('button', { name: 'Close', exact: true }).click();

  // 5. Saved Cases Navigation & Restore
  await page.getByRole('button', { name: 'Saved cases' }).click();
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await page.getByText('USD 65,000.00', { exact: true }).first().waitFor();

  // 6. Partial Analysis / Unknown Handling
  await page.locator('input[name=current]').fill('');
  await page.getByRole('button', { name: 'Build business case' }).click();
  await page.getByText('What is the buyer estimate for current?').waitFor();

  // 7. Multi-Viewport Responsive Validation
  const viewports = [
    { width: 1440, height: 900, name: 'desktop' },
    { width: 1280, height: 800, name: 'laptop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 812, name: 'mobile' },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.screenshot({ path: `/private/tmp/proofdesk-${vp.width}-${vp.name}.png`, fullPage: true });
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (dimensions.scroll > dimensions.client) {
      throw Error(`Horizontal page overflow at ${vp.width}px (${vp.name}): ${JSON.stringify(dimensions)}`);
    }
  }

  // 8. Accessible Keyboard Focus
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => document.activeElement?.tagName);
  if (!focus || focus === 'BODY') throw Error('Keyboard focus not visible');

  if (errors.length) throw Error('Browser errors: ' + errors.join('; '));
  console.log('PASS: Chrome multi-viewport (1440, 1280, 768, 375px), intake, full/partial analysis, save/open, evidence modal, four downloads, keyboard focus, and zero overflow');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
  rmSync(dir, { recursive: true, force: true });
}
