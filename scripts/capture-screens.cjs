/* Capture GitHub App review mimic flow screenshots for delivery docs. */
const fs = require('fs');
const path = require('path');
const puppeteer = require('/Users/rubenmangorrinha/mermaid-sync-service/node_modules/puppeteer');

const OUT = path.join(
  '/Users/rubenmangorrinha/Documents/Cursor - test/plugins-github-App/assets/screenshots',
);
const EDITOR = 'http://localhost:5173';
const SYNC = 'http://localhost:3000';
const PR =
  `${SYNC}/mermaid-sync/pr?owner=rubenmango&repo=mermaid-bot-sandbox&pr=356&file=pr-review-architecture.mmd`;
const REVIEW =
  `${EDITOR}/?review=1&owner=rubenmango&repo=mermaid-bot-sandbox&pr=356&file=pr-review-architecture.mmd&mode=build`;

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log('wrote', name);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();

  // 01 — Fake GitHub PR
  await page.goto(PR, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  await shot(page, '01-fake-pr-comment.png');

  // 02 — Login gate (mimic)
  await page.goto(
    `${SYNC}/mermaid-sync/review?owner=rubenmango&repo=mermaid-bot-sandbox&pr=356&file=pr-review-architecture.mmd&mode=build`,
    { waitUntil: 'networkidle0', timeout: 30000 },
  );
  await new Promise((r) => setTimeout(r, 600));
  await shot(page, '02-login-gate.png');

  // 03 — Editor review pending
  await page.goto(REVIEW, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 2500));
  await shot(page, '03-editor-review-pending.png');

  // 04 — Approve → push ready
  const approve = await page.$('[data-review-action-bar] button');
  // Prefer Approve button by text
  const buttons = await page.$$('[data-review-action-bar] button');
  for (const b of buttons) {
    const t = await page.evaluate((el) => el.textContent || '', b);
    if (t.includes('Approve')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 900));
  await shot(page, '04-editor-push-ready.png');

  // 05 — Push → success / merged pill briefly
  for (const b of await page.$$('[data-review-action-bar] button')) {
    const t = await page.evaluate((el) => el.textContent || '', b);
    if (t.includes('Push')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1600));
  await shot(page, '05-editor-pushed.png');
  await new Promise((r) => setTimeout(r, 1500));

  // Seed a linked diagram in localStorage then capture dashboard views
  await page.goto(`${EDITOR}/dashboard`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => {
    const sample = [
      {
        id: 'dg-delivery-pr356',
        name: 'pr-review-architecture',
        code: 'flowchart TD\n  A[Open] --> B[Review]',
        path: 'GitHub',
        thumb: '/recent-diagram.png',
        updatedAt: Date.now(),
        linkedRepo: {
          owner: 'rubenmango',
          repo: 'mermaid-bot-sandbox',
          pr: '356',
          status: 'merged',
        },
      },
      {
        id: 'dg-delivery-personal',
        name: 'Header hierarchy',
        code: 'flowchart TD\n  A --> B',
        path: 'Personal files',
        thumb: '/recent-diagram.png',
        updatedAt: Date.now() - 60000,
      },
    ];
    localStorage.setItem('mc-unified-editor-diagrams-v2', JSON.stringify(sample));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await shot(page, '06-dashboard-personal.png');

  // GitHub section
  const ghNav = await page.$('[data-dashboard-nav="github"]');
  if (ghNav) {
    await ghNav.click();
    await new Promise((r) => setTimeout(r, 700));
    await shot(page, '07-dashboard-github.png');
  }

  await browser.close();
  console.log('done');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
