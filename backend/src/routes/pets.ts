import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { cacheGet, cacheSet } from '../services/cache';
const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { element, role, rarity, search } = req.query as Record<string,string>;
    const cached = await cacheGet('pets:all');
    let pets = cached ? JSON.parse(cached) : null;
    if (!pets) {
      pets = await prisma.voidPet.findMany({ include: { skills: true }, orderBy: [{ tier:'asc' },{ name:'asc' }] });
      await cacheSet('pets:all', JSON.stringify(pets), 600);
    }
    if (element) pets = pets.filter((p: any) => p.element === element.toUpperCase());
    if (role) pets = pets.filter((p: any) => p.role === role.toUpperCase());
    if (rarity) pets = pets.filter((p: any) => p.rarity === rarity.toUpperCase());
    if (search) pets = pets.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
    res.json({ success: true, data: { pets, total: pets.length }, meta: { patchVersion:'5.25.8' } });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const pet = await prisma.voidPet.findUnique({ where: { id: req.params.id }, include: { skills: true, metaEntries: true } });
    if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
    res.json({ success: true, data: pet });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

export default router;
