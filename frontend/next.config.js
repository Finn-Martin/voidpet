'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const SLOTS   = ['ALL', 'HEAD', 'NECK', 'TRINKET1', 'TRINKET2'];
const SLOT_LABELS: Record<string, string> = { ALL:'All', HEAD:'🎩 Head', NECK:'📿 Neck', TRINKET1:'🔮 Trinket 1', TRINKET2:'💎 Trinket 2' };
const RARITY_LABELS = ['ALL', 'NORMAL', 'RARE', 'EPIC', 'LEGENDARY', 'UBER'];
const RARITY_COLORS: Record<string, string> = {
  NORMAL:'text-gray-400', RARE:'text-blue-400', EPIC:'text-purple-400', LEGENDARY:'text-yellow-400', UBER:'text-pink-400',
};
const SORT_OPTIONS = ['name', 'rarity', 'floor', 'atk', 'def', 'spd', 'crit'];

function StatBubble({ label, value, color }: { label: string; value: number; color: string }) {
  if (!value) return null;
  return <span className={`text-xs font-mono ${color}`}>+{value} {label}</span>;
}

export default function GearPage() {
  const [gear, setGear]         = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [slot, setSlot]         = useState('ALL');
  const [rarity, setRarity]     = useState('ALL');
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState('rarity');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.gear.list().then((d: any) => {
      const list = d.gear ?? d;
      setGear(list);
      setFiltered(list);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = [...gear];
    if (slot   !== 'ALL') f = f.filter(g => g.slot   === slot);
    if (rarity !== 'ALL') f = f.filter(g => g.rarity === rarity);
    if (search) f = f.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.source.toLowerCase().includes(search.toLowerCase()));

    f.sort((a, b) => {
      if (sortBy === 'rarity') {
        const order = { UBER:0, LEGENDARY:1, EPIC:2, RARE:3, NORMAL:4 };
        return (order[a.rarity as keyof typeof order] ?? 5) - (order[b.rarity as keyof typeof order] ?? 5);
      }
      if (sortBy === 'floor') return (a.floorRequired ?? 0) - (b.floorRequired ?? 0);
      if (sortBy === 'atk')  return (b.bonusAtk ?? 0)  - (a.bonusAtk ?? 0);
      if (sortBy === 'def')  return (b.bonusDef ?? 0)  - (a.bonusDef ?? 0);
      if (sortBy === 'spd')  return (b.bonusSpd ?? 0)  - (a.bonusSpd ?? 0);
      if (sortBy === 'crit') return (b.bonusCrit ?? 0) - (a.bonusCrit ?? 0);
      return a.name.localeCompare(b.name);
    });
    setFiltered(f);
  }, [gear, slot, rarity, search, sortBy]);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-extrabold text-white">Gear Database</h1>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or boss..." autoComplete="off"
        className="w-full bg-void-900/60 border border-void-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/70 transition-all" />

      {/* Slot filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SLOTS.map(s => (
          <button key={s} onClick={() => setSlot(s)}
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all
              ${slot === s ? 'bg-void-700 border-void-500 text-white' : 'border-void-700/50 text-gray-500'}`}>
            {SLOT_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Rarity filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {RARITY_LABELS.map(r => (
          <button key={r} onClick={() => setRarity(r)}
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all
              ${rarity === r ? 'bg-void-700 border-void-500 text-white' : 'border-void-700/50 text-gray-500'}
              ${r !== 'ALL' ? RARITY_COLORS[r] : ''}`}>
            {r === 'ALL' ? 'All' : r}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 shrink-0">{filtered.length} items · Sort:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-void-800 border border-void-600 rounded-lg px-2 py-1 text-xs text-white outline-none flex-1">
          {SORT_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      {/* Gear list */}
      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-16 bg-void-900/60 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600 text-sm">No gear matches your filters</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(g => (
            <button key={g.id} onClick={() => setExpanded(expanded === g.id ? null : g.id)}
              className="w-full bg-void-900/40 border border-void-700/30 rounded-xl p-3 text-left hover:border-void-600/50 active:scale-[0.98] transition-all">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white truncate">{g.name}</span>
                    <span className={`text-xs font-bold ${RARITY_COLORS[g.rarity]}`}>{g.rarity}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    <StatBubble label="ATK"  value={g.bonusAtk}     color="text-red-400" />
                    <StatBubble label="DEF"  value={g.bonusDef}     color="text-blue-400" />
                    <StatBubble label="HP"   value={g.bonusStamina} color="text-green-400" />
                    <StatBubble label="SPD"  value={g.bonusSpd}     color="text-yellow-400" />
                    <StatBubble label="CRIT" value={g.bonusCrit}    color="text-purple-400" />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-gray-500">{SLOT_LABELS[g.slot]?.replace(/🎩|📿|🔮|💎/,'').trim()}</div>
                  {g.floorRequired && <div className="text-xs text-gray-600">Floor {g.floorRequired}+</div>}
                </div>
              </div>

              {/* Expanded details */}
              {expanded === g.id && (
                <div className="mt-3 pt-3 border-t border-void-700/30 space-y-2">
                  <div className="text-xs text-gray-400">
                    <span className="text-gray-600">Source: </span>{g.source}
                  </div>
                  {g.specialPassive && (
                    <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2 text-xs">
                      <span className="text-yellow-400 font-bold">✨ Legendary Effect: </span>
                      <span className="text-gray-300">{g.specialPassive}</span>
                    </div>
                  )}
                  {g.ascensionLevel > 0 && (
                    <div className="text-xs text-gray-500">Ascension Level: {g.ascensionLevel}/5</div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
