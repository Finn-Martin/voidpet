const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { headers: { 'Content-Type':'application/json' }, ...opts });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error ?? `HTTP ${r.status}`); }
  const j = await r.json();
  return j.data as T;
}

export const api = {
  pets: {
    list: (params?: Record<string,string>) => {
      const qs = params ? '?'+new URLSearchParams(params) : '';
      return req<any>(`/api/pets${qs}`);
    },
    get: (id: string) => req<any>(`/api/pets/${id}`),
  },
  gear: {
    list: (params?: Record<string,string>) => {
      const qs = params ? '?'+new URLSearchParams(params) : '';
      return req<any>(`/api/gear${qs}`);
    },
  },
  builds: {
    optimize: (body: { petId:string; evolutionLevel:number; priorityStat:string; algorithm?:string; minFloor?:number }) =>
      req<any>('/api/builds/optimize', { method:'POST', body: JSON.stringify(body) }),
    best: (petId: string, evo=5, stat='ATK') => req<any>(`/api/builds/best/${petId}?evolutionLevel=${evo}&priorityStat=${stat}`),
  },
  meta: {
    tierList: () => req<any>('/api/meta/tier-list'),
    reddit: () => req<any>('/api/meta/reddit'),
    confidence: (petId: string) => req<any>(`/api/meta/confidence/${petId}`),
  },
  patches: {
    list: () => req<any>('/api/patches'),
    current: () => req<any>('/api/patches/current'),
  },
};
