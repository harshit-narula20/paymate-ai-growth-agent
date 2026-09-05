import { spawn } from 'child_process';
import path from 'path';

console.log('====================================================');
console.log('🚀 PAYMATE — AI-POWERED AUTONOMOUS GROWTH AGENT');
console.log('====================================================');
console.log('Starting Backend (Port 5000) and Frontend (Port 5173)...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start Backend
const backend = spawn(npmCmd, ['start'], {
  cwd: path.resolve('backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('frontend'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down PayMate services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
