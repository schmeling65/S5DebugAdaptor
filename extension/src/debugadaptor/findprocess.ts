import { exec } from 'child_process';

export async function checkProcess(processName: string) {
  const isWindows = process.platform === 'win32';
  const command = isWindows 
    ? `tasklist /FI "IMAGENAME eq ${processName}"` 
    : `pgrep -x "${processName}"`;

  return new Promise((resolve) => {
    exec(command, (error, stdout) => {
    if (isWindows) {
      const isRunning = stdout.toLowerCase().includes(processName.toLowerCase());
      resolve(isRunning)
    } else {
      const isRunning = !error;
      resolve(isRunning)
    }
  });
  })
}