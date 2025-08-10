// scripts/dev-web-preview.js
// Start Expo Web, verify UI with Playwright (20s timeouts), then dispose ports

const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PREVIEW_PORT = parseInt(process.env.PREVIEW_PORT || '8081', 10);
const CANDIDATE_PORTS = (process.env.PREVIEW_PORTS
  ? process.env.PREVIEW_PORTS.split(',').map((p) => parseInt(p, 10)).filter(Boolean)
  : [PREVIEW_PORT, 19006, 3000, 8082]);
const TIMEOUT_MS = 20_000; // 20s as requested
const TEST_RESULTS_DIR = path.resolve(__dirname, '..', 'test-results');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPortResponding(port) {
  return new Promise((resolve) => {
    const req = http.get({ host: 'localhost', port, path: '/' }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2_000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServerOnAnyPort(ports, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    // eslint-disable-next-line no-await-in-loop
    for (const port of ports) {
      // eslint-disable-next-line no-await-in-loop
      const up = await isPortResponding(port);
      if (up) return port;
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(500);
  }
  throw new Error(`No server responded on ports [${ports.join(', ')}] within ${timeoutMs}ms`);
}

function killPortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const lines = out.split(/\r?\n/).filter((l) => l.includes(`:${port}`));
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0' && !Number.isNaN(Number(pid))) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        // small delay to ensure kill
      } catch {}
    }
  } catch {}
}

function killPortUnix(port) {
  try {
    const out = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
    const pids = out.split(/\r?\n/).filter(Boolean);
    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      } catch {}
    }
  } catch {}
}

async function killPorts(ports) {
  for (const port of ports) {
    if (process.platform === 'win32') killPortWindows(port);
    else killPortUnix(port);
    await sleep(200);
  }
}

async function run() {
  console.log('🚀 Starting Expo Web preview with 20s timeouts...');
  await killPorts([...new Set([...CANDIDATE_PORTS, 19006])]);

  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const expoArgs = [
    '--yes',
    'expo',
    'start',
    '--web',
    '--non-interactive',
    // Port hint for Metro bundler; web may still use 19006, we'll detect it
    '--port',
    String(PREVIEW_PORT),
  ];

  console.log(`🧪 Launching: ${npxCmd} ${expoArgs.join(' ')}`);
  const expoProc = spawn(npxCmd, expoArgs, {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: 'development',
      BROWSER: 'none',
      CI: '1',
    },
    stdio: 'inherit',
    shell: true,
  });

  let cleanupDone = false;
  const cleanup = async () => {
    if (cleanupDone) return;
    cleanupDone = true;
    try {
      if (!expoProc.killed) {
        if (process.platform === 'win32') {
          try { execSync(`taskkill /PID ${expoProc.pid} /T /F`, { stdio: 'ignore' }); } catch {}
        } else {
          expoProc.kill('SIGINT');
        }
      }
    } catch {}
    await sleep(500);
    await killPorts([PREVIEW_PORT, 19006]);
  };

  try {
    const respondingPort = await waitForServerOnAnyPort(CANDIDATE_PORTS, TIMEOUT_MS);
    console.log(`✅ Server is responding on http://localhost:${respondingPort}`);

    // Ensure results dir exists
    fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });

    // Use Playwright to verify UI
    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(TIMEOUT_MS);
    page.setDefaultNavigationTimeout(TIMEOUT_MS);

    const url = `http://localhost:${respondingPort}`;
    console.log(`🌐 Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
    try { await page.waitForLoadState('networkidle', { timeout: 10_000 }); } catch {}
    // Capture console logs
    const consoleLogPath = path.join(TEST_RESULTS_DIR, 'web-preview-console.txt');
    const logs = [];
    page.on('console', (msg) => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    await page.waitForSelector('#root', { timeout: TIMEOUT_MS });
    // Ensure root has some content
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.innerText && root.innerText.trim().length > 0;
    }, null, { timeout: TIMEOUT_MS }).catch(() => {});
    // Try common landing texts
    const candidates = [
      'Solace AI',
      'Get Started',
      'Welcome',
      'Sign In To freud.ai',
      'freud.ai',
      'Powered by Therapeutic AI',
      'Initializing your safe space',
    ];
    let found = false;
    for (const text of candidates) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await page.getByText(text, { exact: false }).first().waitFor({ timeout: 2_000 });
        found = true;
        break;
      } catch {}
    }

    // Fallback: consider UI rendered if root has visible content/size
    if (!found) {
      try {
        const hasContent = await page.evaluate(() => {
          const root = document.getElementById('root');
          if (!root) return false;
          const textOk = (root.innerText || '').trim().length > 10;
          const rect = root.getBoundingClientRect();
          const sizeOk = rect && rect.width > 200 && rect.height > 200;
          return textOk || sizeOk;
        });
        if (hasContent) found = true;
      } catch {}
    }

    const screenshotPath = path.join(TEST_RESULTS_DIR, 'web-preview.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    try { fs.writeFileSync(consoleLogPath, logs.join('\n')); } catch {}
    await browser.close();

    if (!found) {
      console.error(`🖼️  Screenshot saved: ${screenshotPath}`);
      console.error(`📝  Console logs saved: ${consoleLogPath}`);
      throw new Error('UI did not render expected landing texts within 20s');
    }

    console.log(`🖼️  Screenshot saved: ${screenshotPath}`);
    console.log('🎉 UI preview passed. Disposing port...');
  } catch (error) {
    console.error('❌ Preview failed:', error.message);
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}

run();


