'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TIER_COLORS } from '@/lib/utils';

export default function HomePage() {
  const [topPets, setTopPets] = useState<any[]>([]);
  const [patch, setPatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.meta.tierList(), api.patches.current()])
      .then(([tiers, p]) => {
        const top = [...(tiers['S+']??[]), ...(tiers['S']??[])].slice(0,6);
        setTopPets(top); setPatch(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="text-4xl mb-2">🌑</div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">VoidOptimizer</h1>
        <p className="text-gray-400 text-sm">Best gear builds for Voidpet Dungeon</p>
        {patch && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-void-800 text-void-300 text-xs rounded-full border border-void-600">
            Patch {patch.version} — {patch.title}
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/optimizer" className="glass p-4 flex flex-col items-center gap-2 touch-target void-glow-sm hover:void-glow transition-all">
          <span className="text-3xl">⚡</span>
          <span className="font-bold text-sm">Optimize Build</span>
          <span className="text-gray-500 text-xs text-center">Find best gear for your pet</span>
        </Link>
        <Link href="/meta" className="glass p-4 flex flex-col items-center gap-2 touch-target border border-void-700/50 hover:border-void-500/50 transition-all">
          <span className="text-3xl">📊</span>
          <span className="font-bold text-sm">Tier List</span>
          <span className="text-gray-500 text-xs text-center">Community meta rankings</span>
        </Link>
        <Link href="/pets" className="glass p-4 flex flex-col items-center gap-2 touch-target border border-void-700/50 hover:border-void-500/50 transition-all">
          <span className="text-3xl">🐾</span>
          <span className="font-bold text-sm">All Pets</span>
          <span className="text-gray-500 text-xs text-center">Browse 200+ Voidpets</span>
        </Link>
        <Link href="/gear" className="glass p-4 flex flex-col items-center gap-2 touch-target border border-void-700/50 hover:border-void-500/50 transition-all">
          <span className="text-3xl">🗡️</span>
          <span className="font-bold text-sm">Gear DB</span>
          <span className="text-gray-500 text-xs text-center">All hats, necks, trinkets</span>
        </Link>
      </div>

      {/* Top Meta Picks */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Top Meta Pets</h2>
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_,i) => (
            <div key={i} className="glass-sm h-14 animate-pulse" />
          ))}</div>
        ) : topPets.map(pet => (
          <Link key={pet.id} href={`/pets/${pet.id}`}
            className="glass-sm flex items-center gap-3 p-3 hover:border-void-500/50 transition-all">
            <span className={`text-lg font-black min-w-[32px] text-center border rounded-lg px-1 py-0.5 text-xs
              ${pet.tier==='S+' ? 'tier-sp border' : pet.tier==='S' ? 'tier-s border' : 'tier-a border'}`}>
              {pet.tier}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">{pet.displayName}</div>
              <div className="text-xs text-gray-500">{pet.element} · {pet.role}</div>
            </div>
            <span className="text-gray-600 text-sm">→</span>
          </Link>
        ))}
        <Link href="/meta" className="block text-center text-void-400 text-sm py-2 hover:text-void-300">
          View full tier list →
        </Link>
      </div>

      {/* Patch Notes */}
      {patch && (
        <div className="glass-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Latest Patch</h2>
            <span className="text-xs text-void-400">{patch.version}</span>
          </div>
          <div className="space-y-1.5">
            {(patch.changes ?? []).slice(0,3).map((c: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 font-bold ${c.type==='BUFF'?'text-green-400':c.type==='NERF'?'text-red-400':c.type==='NEW'?'text-purple-400':'text-yellow-400'}`}>
                  {c.type}
                </span>
                <span className="text-gray-300">{c.targetName}: {c.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
