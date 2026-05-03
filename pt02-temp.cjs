const { chromium } = require('playwright');

(async () => {
  const BASE_URL = 'http://localhost:5173';
  const user = {
    id: '69ba4817719b355e7f4d54ca',
    email: 'parkviewcity1@gmail.com',
    role: 'society',
    username: 'performance-test',
  };

  const floorPlan = {
    id: 'pt02-synthetic',
    plotWidth: 1000,
    plotHeight: 1000,
    actualLength: 55,
    actualWidth: 25,
    rooms: [
      { id: 1, x: 60, y: 80, width: 260, height: 220, type: 'livingroom', tag: 'livingroom-1' },
      { id: 2, x: 360, y: 80, width: 200, height: 180, type: 'bedroom', tag: 'bedroom-1' },
      { id: 3, x: 360, y: 280, width: 120, height: 120, type: 'bathroom', tag: 'bathroom-1' },
    ],
    mapData: [],
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ userObj, fp }) => {
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', 'pt02-dummy-token');
    localStorage.setItem('loginTime', Date.now().toString());

    const state = { usr: { floorPlan: fp }, key: 'pt02', idx: 0 };
    window.history.replaceState(state, '', '/floor-plan/customize');
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }, { userObj: user, fp: floorPlan });

  await page.waitForURL('**/floor-plan/customize', { timeout: 20000 });
  await page.waitForSelector('text=Floor Plan Customization', { timeout: 20000 });
  await page.waitForFunction(() => document.querySelectorAll('canvas').length >= 1, { timeout: 20000 });

  const iterations = 5;
  const samplesMs = [];

  for (let i = 0; i < iterations; i++) {
    await page.getByRole('button', { name: /2D Edit/i }).click();
    await page.waitForTimeout(200);

    const t0 = await page.evaluate(() => performance.now());
    await page.getByRole('button', { name: /3D View/i }).click();
    await page.waitForFunction(() => document.querySelectorAll('canvas').length >= 2, { timeout: 30000 });
    const t1 = await page.evaluate(() => performance.now());

    samplesMs.push(t1 - t0);
    await page.waitForTimeout(300);
  }

  const avg = samplesMs.reduce((a, b) => a + b, 0) / samplesMs.length;
  const sorted = [...samplesMs].sort((a, b) => a - b);
  const p95 = sorted[Math.max(0, Math.floor(sorted.length * 0.95) - 1)];
  const max = sorted[sorted.length - 1];

  console.log(JSON.stringify({ samples_ms: samplesMs.map(v => Number(v.toFixed(2))), avg_ms: Number(avg.toFixed(2)), p95_ms: Number(p95.toFixed(2)), max_ms: Number(max.toFixed(2)) }));

  await browser.close();
})();
