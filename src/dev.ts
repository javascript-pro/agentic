import { exec } from 'node:child_process';
import { startServer } from './server.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const url = `http://localhost:${PORT}`;

async function main() {
  await startServer(PORT);
  
  const openCommand =
    process.platform === 'win32'
      ? `start ${url}`
      : process.platform === 'darwin'
      ? `open ${url}`
      : `xdg-open ${url}`;

  console.log(`[Dev] Opening ${url} in browser...`);
  exec(openCommand, (err) => {
    if (err) {
      console.warn(`[Dev] Could not automatically open browser: ${err.message}`);
    }
  });
}

main();
