import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
router.get('/', async (_req, res) => {
  try {
    const patches = await prisma.patchNote.findMany({ orderBy:{ releaseDate:'desc' } });
    res.json({ success:true, data:patches });
  } catch (e: any) { res.status(500).json({ success:false, error:e.message }); }
});
router.get('/current', async (_req, res) => {
  try {
    const patch = await prisma.patchNote.findFirst({ where:{ isCurrentPatch:true } });
    res.json({ success:true, data:patch });
  } catch (e: any) { res.status(500).json({ success:false, error:e.message }); }
});
export default router;
