import { createClient, RedisClientType } from 'redis';
let client: RedisClientType | null = null;
const memStore = new Map<string, { val: string; exp: number }>();

export async function getCache(): Promise<RedisClientType | null> {
  if (!process.env.REDIS_URL) return null;
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL }) as RedisClientType;
    client.on('error', () => { client = null; });
    try { await client.connect(); } catch { client = null; }
  }
  return client;
}

export async function cacheGet(key: string): Promise<string | null> {
  const c = await getCache();
  if (c) return c.get(key);
  const e = memStore.get(key);
  if (!e || Date.now() > e.exp) return null;
  return e.val;
}

export async function cacheSet(key: string, val: string, ttlSecs = 300): Promise<void> {
  const c = await getCache();
  if (c) { await c.setEx(key, ttlSecs, val); return; }
  memStore.set(key, { val, exp: Date.now() + ttlSecs * 1000 });
}

export async function cacheDel(key: string): Promise<void> {
  const c = await getCache();
  if (c) { await c.del(key); return; }
  memStore.delete(key);
}
