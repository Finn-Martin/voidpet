import { Router } from 'express';
import { cacheGet, cacheSet } from '../services/cache';
import { optimizeBuild } from '../services/optimizer';
const router = Router();

router.post('/optimize', async (req, res) => {
  try {
    const { petId, evolutionLevel = 5, priorityStat = 'ATK', excludeGear = [], minFloor, algorithm = 'BRUTE_FORCE' } = req.body;
    if (!petId) return res.status(400).json({ success: false, error: 'petId is required' });
    const cacheKey = `optimize:${petId}:${evolutionLevel}:${priorityStat}:${algorithm}:${minFloor??''}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: JSON.parse(cached), meta: { cachedAt: new Date().toISOString(), patchVersion:'5.25.8' } });
    const result = await optimizeBuild({ petId, evolutionLevel, priorityStat, excludeGear, minFloor, algorithm });
    await cacheSet(cacheKey, JSON.stringify(result), 300);
    res.json({ success: true, data: result, meta: { patchVersion:'5.25.8', computedMs: result.computedMs } });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/best/:petId', async (req, res) => {
  try {
    const { evolutionLevel = '5', priorityStat = 'ATK' } = req.query as Record<string,string>;
    const result = await optimizeBuild({ petId: req.params.petId, evolutionLevel: parseInt(evolutionLevel), priorityStat });
    res.json({ success: true, data: result, meta: { patchVersion:'5.25.8' } });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

export default router;
