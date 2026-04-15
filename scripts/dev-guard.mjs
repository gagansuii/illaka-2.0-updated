import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = path.join(projectRoot, '.next', 'dev', 'lock');
const requestedPort = Number(process.env.PORT ?? 3000);
const useWebpack = process.argv.includes('--webpack');

function ensureNoStaleLock() {
  if (!fs.existsSync(lockPath)) {
    return;
  }

  try {
    const fd = fs.openSync(lockPath, 'r+');
    fs.closeSync(fd);
    fs.unlinkSync(lockPath);
    console.warn('[dev-guard] Removed stale .next/dev/lock file.');
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : '';
    if (code === 'EPERM' || code === 'EBUSY') {
      console.error('[dev-guard] A Next.js dev server is already running for this workspace (lock file is active).');
      console.error('[dev-guard] Stop the current dev server before starting another one.');
      process.exit(1);
    }
    throw error;
  }
}

function warnIfPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err && typeof err === 'object' && 'code' in err && err.code === 'EADDRINUSE') {
        console.warn(`[dev-guard] Port ${port} is already in use. Next.js will choose another available port.`);
      }
      resolve();
    });
    server.once('listening', () => {
      server.close(() => resolve());
    });
    server.listen(port, '0.0.0.0');
  });
}

ensureNoStaleLock();
await warnIfPortInUse(requestedPort);

const nextBin = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
const nextArgs = ['dev'];
if (useWebpack) {
  nextArgs.push('--webpack');
}

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('[dev-guard] Failed to start Next.js dev server:', error);
  process.exit(1);
});
