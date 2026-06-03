export const ELEMENT_COLORS: Record<string, string> = {
  FIRE:'text-orange-400', WATER:'text-cyan-400', WOOD:'text-green-400', EARTH:'text-yellow-600', METAL:'text-gray-300',
};
export const ELEMENT_BG: Record<string, string> = {
  FIRE:'bg-orange-500/20 border-orange-500/40', WATER:'bg-cyan-500/20 border-cyan-500/40',
  WOOD:'bg-green-500/20 border-green-500/40', EARTH:'bg-yellow-600/20 border-yellow-600/40',
  METAL:'bg-gray-400/20 border-gray-400/40',
};
export const ELEMENT_EMOJI: Record<string,string> = { FIRE:'🔥',WATER:'💧',WOOD:'🌿',EARTH:'🪨',METAL:'⚙️' };
export const ROLE_EMOJI: Record<string,string>    = { FIGHTER:'⚔️', TANK:'🛡️', HEALER:'💚' };
export const ROLE_COLORS: Record<string,string>   = { FIGHTER:'text-red-400', TANK:'text-blue-400', HEALER:'text-green-400' };
export const RARITY_COLORS: Record<string,string> = {
  NORMAL:'text-gray-400', RARE:'text-blue-400', EPIC:'text-purple-400', LEGENDARY:'text-yellow-400', UBER:'text-pink-400',
};
export const TIER_COLORS: Record<string,string> = {
  'S+':'text-pink-400','S':'text-yellow-400','A':'text-green-400','B':'text-blue-400','C':'text-gray-400','D':'text-red-400',
};
export const STAT_LABELS: Record<string,string> = { atk:'ATK',def:'DEF',stamina:'HP',spd:'SPD',crit:'CRIT%' };
export function tierToNum(t: string): number { return {'S+':0,'S':1,'A':2,'B':3,'C':4,'D':5}[t]??6; }
export function clamp(v:number,min:number,max:number){ return Math.min(max,Math.max(min,v)); }
