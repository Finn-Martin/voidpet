'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ELEMENT_EMOJI, ROLE_EMOJI, TIER_COLORS, RARITY_COLORS } from '@/lib/utils';

const ELEMENTS = ['ALL','FIRE','WATER','WOOD','EARTH','METAL'];
const ROLES    = ['ALL','FIGHTER','TANK','HEALER'];

export default function PetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [element, setElement] = useState('ALL');
  const [role, setRole] = useState('ALL');

  useEffect(() => {
    api.pets.list()
      .then((d: any) => { setPets(d.pets ?? d); setFiltered(d.pets ?? d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = [...pets];
    if (search) f = f.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (element !== 'ALL') f = f.filter(p => p.element === element);
    if (role !== 'ALL') f = f.filter(p => p.role === role);
    setFiltered(f);
  }, [pets, search, element, role]);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-extrabold text-white">All Voidpets</h1>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search pets..." autoComplete="off"
        className="w-full glass-sm px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-void-500/70 transition-all touch-target" />

      {/* Element filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {ELEMENTS.map(e => (
          <button key={e} onClick={() => setElement(e)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border touch-target transition-all
              ${element===e ? 'bg-void-700 border-void-500 text-white' : 'border-void-700/50 text-gray-500 hover:text-gray-300'}`}>
            {e === 'ALL' ? 'All' : `${ELEMENT_EMOJI[e]} ${e}`}
          </button>
        ))}
      </div>

      {/* Role filter */}
      <div className="flex gap-2">
        {ROLES.map(r => (
          <button key={r} onClick={() => setRole(r)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold border touch-target transition-all
              ${role===r ? 'bg-void-700 border-void-500 text-white' : 'border-void-700/50 text-gray-500'}`}>
            {r === 'ALL' ? 'All' : `${ROLE_EMOJI[r]} ${r}`}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-600">{filtered.length} pets</p>

      {/* Pet grid */}
      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_,i) => <div key={i} className="glass-sm h-16 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No pets match your filters</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(pet => (
            <Link key={pet.id} href={`/pets/${pet.id}`}
              className="glass-sm flex items-center gap-3 p-3 hover:border-void-600/50 active:scale-[0.98] transition-all touch-target">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                ${pet.element==='FIRE'?'bg-orange-500/20':pet.element==='WATER'?'bg-cyan-500/20':pet.element==='WOOD'?'bg-green-500/20':pet.element==='EARTH'?'bg-yellow-600/20':'bg-gray-400/20'}`}>
                {ELEMENT_EMOJI[pet.element]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white truncate">{pet.displayName}</span>
                  <span className={`text-xs font-bold ${TIER_COLORS[pet.tier]}`}>{pet.tier}</span>
                </div>
                <div className="text-xs text-gray-500">{ROLE_EMOJI[pet.role]} {pet.role} · {pet.rarity}</div>
              </div>
              <div className="text-xs text-gray-600 shrink-0">→</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
