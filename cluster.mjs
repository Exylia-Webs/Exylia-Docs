// Runs NODE_WORKERS copies of the server on the same port (default 1, which just starts the
// server in this process). Each copy gets WORKER_ID=1..N; scheduled jobs and other once-per-app
// work must only run where WORKER_ID is "1". A copy that crashes is restarted with the same id.
// Usage: node cluster.mjs [entry]   (entry defaults to ./server.js, relative to the cwd)
import cluster from "node:cluster";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const workers = Math.max(1, Number.parseInt(process.env.NODE_WORKERS ?? "1", 10) || 1);
const entry = pathToFileURL(resolve(process.argv[2] ?? process.env.WORKER_ENTRY ?? "./server.js")).href;

if (workers === 1 || cluster.isWorker) {
  process.env.WORKER_ID ??= "1";
  // The entry sees the arguments after it as its own (`node cluster.mjs next/dist/bin/next start`).
  if (process.argv[2] !== undefined) process.argv.splice(2, 1);
  await import(entry);
} else {
  const ids = new Map();
  let stopping = false;
  const fork = (id) => ids.set(cluster.fork({ WORKER_ID: String(id) }).id, id);
  for (let id = 1; id <= workers; id++) fork(id);

  cluster.on("exit", (worker, code, signal) => {
    const id = ids.get(worker.id);
    ids.delete(worker.id);
    if (stopping) {
      if (ids.size === 0) process.exit(0);
      return;
    }
    console.error(`worker ${id} exited (${signal ?? code}), restarting`);
    setTimeout(() => fork(id), 1000);
  });

  const stop = (signal) => {
    if (stopping) return;
    stopping = true;
    for (const worker of Object.values(cluster.workers ?? {})) worker?.process.kill(signal);
    setTimeout(() => process.exit(0), 25_000).unref();
  };
  process.on("SIGTERM", () => stop("SIGTERM"));
  process.on("SIGINT", () => stop("SIGINT"));
}
