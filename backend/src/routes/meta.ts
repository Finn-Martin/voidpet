import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { cacheGet, cacheSet } from '../services/cache';
const router = Router();
const prisma = new PrismaClient();

router.get('/tier-list', async (req, res) => {
  try {
    const cached = await cacheGet('meta:tierlist');
    if (cached) return res.json({ success:true, data: JSON.parse(cached), meta:{ patchVersion:'5.25.8', cachedAt:new Date().toISOString() } });
    const pets = await prisma.voidPet.findMany({ select:{ id:true, name:true, displayName:true, element:true, role:true, rarity:true, tier:true, tierSource:true, tags:true }, orderBy:[{ tier:'asc' },{ name:'asc' }] });
    const grouped = pets.reduce((acc: any, p) => { acc[p.tier] = acc[p.tier]??[]; acc[p.tier].push(p); return acc; }, {});
    await cacheSet('meta:tierlist', JSON.stringify(grouped), 1800);
    res.json({ success:true, data: grouped, meta:{ patchVersion:'5.25.8' } });
  } catch (e: any) { res.status(500).json({ success:false, error:e.message }); }
});

router.get('/reddit', async (req, res) => {
  try {
    const posts = await prisma.redditPost.findMany({ orderBy:{ score:'desc' }, take:20 });
    res.json({ success:true, data: posts });
  } catch (e: any) { res.status(500).json({ success:false, error:e.message }); }
});

router.get('/confidence/:petId', async (req, res) => {
  try {
    const pet = await prisma.voidPet.findUnique({ where:{ id:req.params.petId } });
    if (!pet) return res.status(404).json({ success:false, error:'Pet not found' });
    const reddit = await prisma.redditPost.findMany({ where:{ petMentions:{ has: pet.name } } });
    const tierScores: Record<string,number> = { 'S+':95,'S':85,'A':70,'B':55,'C':40,'D':25 };
    const mathScore   = Math.min(25, (tierScores[pet.tier]??50) * 0.25);
    const community   = Math.min(25, (reddit.reduce((s,r)=>s+(r.sentiment*r.score),0) / Math.max(1,reddit.length) + 1) * 12.5);
    const freshness   = 22; // current patch
    const popularity  = Math.min(25, reddit.length * 5);
    const total       = Math.round(mathScore + community + freshness + popularity);
    res.json({ success:true, data:{ petId:req.params.petId, petName:pet.name, breakdown:{ mathScore, communityScore:community, patchFreshness:freshness, popularityScore:popularity, total }, recommendation: total>=80?'✅ Strong meta pick':total>=60?'⚡ Viable pick':'⚠️ Situational' } });
  } catch (e: any) { res.status(500).json({ success:false, error:e.message }); }
});

export default router;
