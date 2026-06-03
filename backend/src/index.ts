'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ELEMENT_EMOJI, ROLE_EMOJI } from '@/lib/utils';

const TIER_ORDER = ['S+', 'S', 'A', 'B', 'C', 'D'];
const TIER_STYLES: Record<string, string> = {
  'S+': 'bg-pink-500/10 border-pink-500/30 text-pink-400',
  'S':  'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  'A':  'bg-green-500/10 border-green-500/30 text-green-400',
  'B':  'bg-blue-500/10 border-blue-500/30 text-blue-400',
  'C':  'bg-gray-500/10 border-gray-500/30 text-gray-400',
  'D':  'bg-red-500/10 border-red-500/30 text-red-400',
};

export default function MetaPage() {
  const [tierList, setTierList] = useState<any>({});
  const [redditPosts, setRedditPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'tiers' | 'reddit'>('tiers');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([api.meta.tierList(), api.meta.reddit()])
      .then(([tl, rp]) => { setTierList(tl); setRedditPosts(rp ?? []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredTierList = Object.fromEntries(
    Object.entries(tierList).map(([tier, pets]: [string, any]) => [
      tier,
      roleFilter === 'ALL' ? pets : pets.filter((p: any) => p.role === roleFilter),
    ]).filter(([, pets]) => (pets as any[]).length > 0)
  );

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-white">Meta Rankings</h1>
        <span className="text-xs text-purple-400 border border-purple-700/40 rounded-full px-2 py-0.5">Patch 5.25.8</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-void-900/60 rounded-xl p-1 gap-1">
        <button onClick={() => setTab('tiers')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'tiers' ? 'bg-purple-700/60 text-white' : 'text-gray-500'}`}>
          📊 Tier List
        </button>
        <button onClick={() => setTab('reddit')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'reddit' ? 'bg-purple-700/60 text-white' : 'text-gray-500'}`}>
          🗣️ Community
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-void-900/60 rounded-xl animate-pulse" />)}</div>
      ) : tab === 'tiers' ? (
        <>
          {/* Role filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['ALL', 'FIGHTER', 'TANK', 'HEALER'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                  ${roleFilter === r ? 'bg-void-700 border-void-500 text-white' : 'border-void-700/50 text-gray-500'}`}>
                {r === 'ALL' ? 'All Roles' : `${ROLE_EMOJI[r]} ${r}`}
              </button>
            ))}
          </div>

          {/* Tier rows */}
          {TIER_ORDER.map(tier => {
            const pets = filteredTierList[tier];
            if (!pets?.length) return null;
            return (
              <div key={tier} className="space-y-1.5">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border w-fit ${TIER_STYLES[tier]}`}>
                  <span className="font-black text-lg">{tier}</span>
                  <span className="text-xs opacity-70">{pets.length} pet{pets.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-1">
                  {pets.map((p: any) => (
                    <Link key={p.id} href={`/pets/${p.id}`}
                      className="flex items-center gap-3 p-3 bg-void-900/40 border border-void-700/30 rounded-xl hover:border-void-600/50 transition-all">
                      <span className="text-lg w-8 text-center">{ELEMENT_EMOJI[p.element]}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-white truncate block">{p.displayName}</span>
                        <span className="text-xs text-gray-500">{ROLE_EMOJI[p.role]} {p.role} · {p.rarity}</span>
                      </div>
                      {p.tags?.includes('meta') && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full px-1.5 py-0.5 shrink-0">META</span>
                      )}
                      <span className="text-gray-600 text-xs shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        /* Reddit/Community tab */
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Top community discussions about builds and meta. Sentiment-analysed.</p>
          {redditPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm">No community posts loaded yet</div>
          ) : redditPosts.map((post: any) => (
            <div key={post.id} className="bg-void-900/40 border border-void-700/30 rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-white leading-tight flex-1">{post.title}</h3>
                <div className={`shrink-0 text-xs font-mono font-bold rounded px-1.5 py-0.5 border
                  ${post.sentiment > 0.7 ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                    post.sentiment > 0.3 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' :
                    'text-red-400 bg-red-500/10 border-red-500/30'}`}>
                  {post.sentiment > 0.7 ? '😄' : post.sentiment > 0.3 ? '😐' : '😤'}
                  {(post.sentiment * 100).toFixed(0)}%
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{post.body}</p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>👤 {post.author}</span>
                <span>⬆️ {post.score?.toLocaleString()}</span>
                {post.petMentions?.length > 0 && (
                  <span>🐾 {post.petMentions.join(', ')}</span>
                )}
              </div>
              {post.keyPhrases?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {post.keyPhrases.slice(0, 4).map((kp: string) => (
                    <span key={kp} className="text-xs bg-void-800 text-gray-500 rounded-full px-2 py-0.5">{kp}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
