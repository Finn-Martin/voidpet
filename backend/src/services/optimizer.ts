'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ELEMENT_EMOJI, ROLE_EMOJI, TIER_COLORS, RARITY_COLORS } from '@/lib/utils';

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono font-bold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-void-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [confidence, setConfidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evo, setEvo] = useState(5);

  useEffect(() => {
    Promise.all([api.pets.get(id), api.meta.confidence(id)])
      .then(([p, c]) => { setPet(p); setConfidence(c); })
      .catch(() => router.push('/pets'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-void-900/60 rounded-2xl animate-pulse" />)}
    </div>
  );
  if (!pet) return null;

  const scaledStats = {
    atk:     Math.round(pet.baseAtk     + pet.growthAtk     * evo),
    def:     Math.round(pet.baseDef     + pet.growthDef     * evo),
    stamina: Math.round(pet.baseStamina + pet.growthStamina * evo),
    spd:     Math.round(pet.baseSpd     + pet.growthSpd     * evo),
    crit:    Math.round(Math.min(100, pet.baseCrit + pet.growthCrit * evo) * 10) / 10,
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      <button onClick={() => router.back()} className="text-gray-500 text-sm hover:text-white transition-colors">← Back</button>

      {/* Header card */}
      <div className="bg-void-900/60 backdrop-blur-md border border-void-700/50 rounded-2xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0
            ${pet.element === 'FIRE' ? 'bg-orange-500/20' : pet.element === 'WATER' ? 'bg-cyan-500/20' :
              pet.element === 'WOOD' ? 'bg-green-500/20' : pet.element === 'EARTH' ? 'bg-yellow-600/20' : 'bg-gray-400/20'}`}>
            {ELEMENT_EMOJI[pet.element]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">{pet.displayName}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${TIER_COLORS[pet.tier]}
                ${pet.tier === 'S+' ? 'bg-pink-500/10 border-pink-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                {pet.tier}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span>{ELEMENT_EMOJI[pet.element]} {pet.element}</span>
              <span>·</span>
              <span>{ROLE_EMOJI[pet.role]} {pet.role}</span>
              <span>·</span>
              <span className={RARITY_COLORS[pet.rarity]}>{pet.rarity}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{pet.description}</p>
          </div>
        </div>
        {pet.passive && (
          <div className="bg-void-800/50 rounded-xl p-3 text-xs">
            <span className="text-purple-300 font-bold">Passive: </span>
            <span className="text-gray-300">{pet.passive}</span>
          </div>
        )}
      </div>

      {/* Evolution slider */}
      <div className="bg-void-900/40 border border-void-700/30 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-300">Evolution Stage</h2>
          <span className="text-purple-400 font-mono font-bold">Stage {evo}</span>
        </div>
        <input type="range" min={1} max={5} value={evo} onChange={e => setEvo(+e.target.value)}
          className="w-full accent-purple-500 cursor-pointer" style={{ height: '44px' }} />
        <div className="flex justify-between text-xs text-gray-600">
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={s === evo ? 'text-purple-400 font-bold' : ''}>Stage {s}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-void-900/40 border border-void-700/30 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-bold text-gray-300">Stats at Stage {evo}</h2>
        <StatBar label="ATK"    value={scaledStats.atk}     max={600} color="bg-red-500" />
        <StatBar label="DEF"    value={scaledStats.def}     max={600} color="bg-blue-500" />
        <StatBar label="HP"     value={scaledStats.stamina} max={700} color="bg-green-500" />
        <StatBar label="SPD"    value={scaledStats.spd}     max={500} color="bg-yellow-500" />
        <StatBar label="CRIT %" value={scaledStats.crit}    max={100} color="bg-purple-500" />
      </div>

      {/* Skills */}
      {pet.skills?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Skills</h2>
          {pet.skills.map((s: any) => (
            <div key={s.id} className="bg-void-900/40 border border-void-700/30 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white">{s.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold
                  ${s.type === 'ULTIMATE' ? 'bg-yellow-500/20 text-yellow-400' :
                    s.type === 'ACTIVE'   ? 'bg-purple-500/20 text-purple-400' :
                    s.type === 'PASSIVE'  ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                  {s.type}
                </span>
                {s.cooldown > 0 && <span className="text-xs text-gray-600">CD: {s.cooldown}</span>}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{s.effect}</p>
            </div>
          ))}
        </div>
      )}

      {/* Confidence */}
      {confidence && (
        <div className="bg-void-900/40 border border-void-700/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-300">Meta Confidence</h2>
            <span className="text-2xl font-black text-purple-400">{confidence.breakdown.total}/100</span>
          </div>
          {[
            { label: 'Math Score',   val: confidence.breakdown.mathScore,      max: 25, color: 'bg-red-500' },
            { label: 'Community',    val: confidence.breakdown.communityScore,  max: 25, color: 'bg-purple-500' },
            { label: 'Patch Fresh',  val: confidence.breakdown.patchFreshness,  max: 25, color: 'bg-green-500' },
            { label: 'Popularity',   val: confidence.breakdown.popularityScore, max: 25, color: 'bg-yellow-500' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-24 shrink-0">{row.label}</span>
              <div className="flex-1 h-1.5 bg-void-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.val / row.max) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-gray-400 w-6 text-right">{Math.round(row.val)}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 italic">{confidence.recommendation}</p>
        </div>
      )}

      {/* CTA */}
      <Link href={`/optimizer?petId=${pet.id}`}
        className="block w-full text-center py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
        style={{ boxShadow: '0 0 20px rgba(168,85,247,0.3)' }}>
        ⚡ Optimize This Pet's Build
      </Link>
    </div>
  );
}
