import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Shree Samarth PG Management System...\n');

// Start backend server - SECURITY: No shell to prevent command injection
const backend = spawn('py', ['server/app.py'], {
  cwd: __dirname,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('❌ Failed to start backend:', err);
  process.exit(1);
});

backend.on('close', (code) => {
  console.log(`Backend exited with code ${code}`);
});

// Wait a bit then start frontend
setTimeout(() => {
  console.log('📦 Starting frontend server...\n');

  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  frontend.on('error', (err) => {
    console.error('❌ Failed to start frontend:', err);
    process.exit(1);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend exited with code ${code}`);
  });
}, 2000);

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers gracefully...');
  backend.kill('SIGTERM');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers gracefully...');
  backend.kill('SIGTERM');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});