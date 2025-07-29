// file: latency-check.ts (or .js if not using TypeScript)

import https from 'https';
import os from 'os';
import { performance } from 'perf_hooks';
import dns from 'dns';

const urlToTest = 'https://google.com';

function checkSystemStats() {
  const cpus = os.cpus();
  const load = os.loadavg();
  const memUsage = {
    total: os.totalmem() / 1024 / 1024,
    free: os.freemem() / 1024 / 1024,
  };

  console.log('\n🖥️  System Info:');
  console.log(`- CPU Cores: ${cpus.length}`);
  console.log(`- Avg Load (1m): ${load[0].toFixed(2)}`);
  console.log(`- Memory: ${memUsage.free.toFixed(2)} MB free / ${memUsage.total.toFixed(2)} MB total`);
}

function checkDnsLatency(domain: string): Promise<number> {
  return new Promise((resolve) => {
    const start = performance.now();
    dns.lookup(domain, () => {
      const end = performance.now();
      resolve(end - start);
    });
  });
}

function checkHttpsLatency(url: string): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    https.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        const end = performance.now();
        console.log(`🌐 HTTPS request to ${url}`);
        console.log(`- Total response time: ${Math.round(end - start)} ms`);
        resolve();
      });
    }).on('error', (err) => {
      console.error('❌ HTTPS error:', err.message);
      resolve();
    });
  });
}

async function runLatencyCheck() {
  console.log('🚀 Running Latency + System Check...\n');

  const dnsLatency = await checkDnsLatency('google.com');
  console.log(`📡 DNS Lookup Time: ${Math.round(dnsLatency)} ms`);

  await checkHttpsLatency(urlToTest);

  checkSystemStats();
}

runLatencyCheck();
