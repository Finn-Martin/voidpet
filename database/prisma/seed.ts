import { PrismaClient, Element, PetRole, PetRarity, GearSlot, GearRarity, SkillType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Voidpet Dungeon data...');
  await prisma.communityMention.deleteMany();
  await prisma.redditPost.deleteMany();
  await prisma.metaEntry.deleteMany();
  await prisma.build.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.gearItem.deleteMany();
  await prisma.voidPet.deleteMany();
  await prisma.patchNote.deleteMany();

  // Patch notes
  await prisma.patchNote.createMany({ data: [
    { version: '5.20.0', releaseDate: new Date('2025-12-01'), title: 'Balance Pass', isCurrentPatch: false,
      changes: [{ type:'NERF', targetName:'Greed', targetType:'PET', description:'ATK growth -5%', magnitude:'MINOR' }] },
    { version: '5.25.8', releaseDate: new Date('2026-04-15'), title: 'Ascension Update', isCurrentPatch: true,
      changes: [{ type:'NEW', targetName:'Lust (HF)', targetType:'PET', description:'Higher Form Lust added', magnitude:'MAJOR' },
                { type:'BUFF', targetName:'Persistence', targetType:'PET', description:'Heal coefficient +10%', magnitude:'MODERATE' }] },
  ]});

  // Pets (real Voidpet Dungeon pets from community tier lists)
  const pets = [
    // S+ Tier
    { name:'Lust', displayName:'Lust (HF)', element:Element.METAL, role:PetRole.FIGHTER, rarity:PetRarity.UBER, isHigherForm:true, tier:'S+',
      baseAtk:85, baseDef:45, baseStamina:55, baseSpd:70, baseCrit:20,
      growthAtk:8.5, growthDef:4.0, growthStamina:5.0, growthSpd:5.5, growthCrit:0.8,
      description:'Bypasses tank targeting with Blindside. Deals extra damage to high-HP enemies.',
      passive:'Blindside: Can target any enemy regardless of tank taunt. +15% dmg vs targets above 70% HP.',
      tags:['pvp','boss','blindside','meta'],
      skills:[
        { name:'Metalstrike', type:SkillType.BASIC, description:'Basic metal attack', effect:'Deals 100% ATK metal damage', cooldown:0 },
        { name:'Blindside', type:SkillType.ACTIVE, description:'Ignores taunt, targets any enemy', effect:'Target any enemy. 150% ATK. +25% if target above 70% HP', cooldown:3 },
        { name:'Desire Rush', type:SkillType.ULTIMATE, description:'All-out metal assault', effect:'300% ATK metal damage. Ignores 20% DEF', cooldown:6 },
      ]},
    { name:'Merry', displayName:'Merry', element:Element.WOOD, role:PetRole.HEALER, rarity:PetRarity.EPIC, isHigherForm:false, tier:'S+',
      baseAtk:40, baseDef:55, baseStamina:70, baseSpd:75, baseCrit:10,
      growthAtk:3.5, growthDef:5.0, growthStamina:7.0, growthSpd:6.5, growthCrit:0.4,
      description:'Best healer in the game. Ding Dong lets all teammates basic attack simultaneously.',
      passive:'Rejuvenate: Heals the lowest-HP ally for 8% max HP each turn.',
      tags:['healer','support','meta','must-have'],
      skills:[
        { name:'Leaf Toss', type:SkillType.BASIC, description:'Weak wood attack', effect:'60% ATK wood damage', cooldown:0 },
        { name:'Mend', type:SkillType.ACTIVE, description:'Heal + debuff cleanse', effect:'Heal one ally 120% DEF. Remove 1 debuff', cooldown:2 },
        { name:'Ding Dong', type:SkillType.ULTIMATE, description:'All allies attack simultaneously', effect:'All allies perform their basic attack. Heal all 30% max HP', cooldown:5 },
      ]},
    { name:'Down Bad', displayName:'Down Bad', element:Element.WOOD, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S+',
      baseAtk:80, baseDef:40, baseStamina:50, baseSpd:80, baseCrit:18,
      growthAtk:8.0, growthDef:3.5, growthStamina:4.5, growthSpd:7.0, growthCrit:0.7,
      description:'Extreme speed fighter. Attacks multiple times per round at high SPD thresholds.',
      passive:'Hyperfocus: Gains +10% Crit for each enemy defeated this battle.',
      tags:['speed','fighter','pvp','multi-hit'],
      skills:[
        { name:'Wood Slash', type:SkillType.BASIC, description:'Fast wood slash', effect:'90% ATK wood damage', cooldown:0 },
        { name:'Double Down', type:SkillType.ACTIVE, description:'Two rapid strikes', effect:'2x 80% ATK strikes. Second hit crits if first hit crits', cooldown:2 },
        { name:'Going All Out', type:SkillType.ULTIMATE, description:'Frenzied assault', effect:'4x 70% ATK. +20% Crit rate for 3 turns', cooldown:5 },
      ]},
    { name:'Persistence', displayName:'Persistence', element:Element.WATER, role:PetRole.HEALER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S+',
      baseAtk:35, baseDef:60, baseStamina:75, baseSpd:65, baseCrit:8,
      growthAtk:3.0, growthDef:5.5, growthStamina:7.5, growthSpd:5.5, growthCrit:0.3,
      description:'Passive AoE healing every turn. Shield ability protects entire team.',
      passive:'Endure: All allies regenerate 5% max HP at the start of each turn.',
      tags:['healer','support','regen','shields'],
      skills:[
        { name:'Water Pulse', type:SkillType.BASIC, description:'Water heal-attack', effect:'50% ATK and heal self 20% ATK as HP', cooldown:0 },
        { name:'Warm Dream', type:SkillType.ACTIVE, description:'Shield + DEF up', effect:'Shield all allies for 80% DEF. +15% DEF for 2 turns', cooldown:3 },
        { name:'Serene Flow', type:SkillType.ULTIMATE, description:'Full team restoration', effect:'Heal all allies 180% DEF. Cleanse all debuffs', cooldown:6 },
      ]},
    { name:'Defiance', displayName:'Defiance', element:Element.FIRE, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S+',
      baseAtk:82, baseDef:42, baseStamina:52, baseSpd:68, baseCrit:16,
      growthAtk:8.2, growthDef:3.8, growthStamina:4.8, growthSpd:5.8, growthCrit:0.65,
      description:'Fire burst fighter. Ignores partial DEF on skills.',
      passive:'Burning Will: When below 50% HP, gains +25% ATK.',
      tags:['fire','burst','fighter','clutch'],
      skills:[
        { name:'Ember Strike', type:SkillType.BASIC, description:'Basic fire hit', effect:'95% ATK fire damage', cooldown:0 },
        { name:'Defiant Flame', type:SkillType.ACTIVE, description:'Powerful fire hit ignoring DEF', effect:'160% ATK fire damage. Ignores 15% DEF', cooldown:2 },
        { name:'Stand Your Ground', type:SkillType.ULTIMATE, description:'Massive fire explosion', effect:'280% ATK fire damage to all enemies. If below 50% HP: +40% dmg', cooldown:5 },
      ]},
    { name:'Rapture', displayName:'Rapture', element:Element.FIRE, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S+',
      baseAtk:84, baseDef:38, baseStamina:48, baseSpd:72, baseCrit:19,
      growthAtk:8.4, growthDef:3.5, growthStamina:4.3, growthSpd:6.2, growthCrit:0.75,
      description:'High Crit, high SPD fire fighter. One of the fastest damage dealers.',
      passive:'Ecstasy: Crits grant +5% SPD (max 3 stacks). Resets on turn end.',
      tags:['fire','crit','speed','fighter','pvp'],
      skills:[
        { name:'Flash Burn', type:SkillType.BASIC, description:'Quick fire strike', effect:'95% ATK fire damage, high crit priority', cooldown:0 },
        { name:'Bliss Strike', type:SkillType.ACTIVE, description:'Crit-focused strike', effect:'150% ATK fire damage. +15% Crit on next attack if this crits', cooldown:2 },
        { name:'Transcend', type:SkillType.ULTIMATE, description:'Full power release', effect:'250% ATK fire damage. Guaranteed crit. +30% SPD for 2 turns', cooldown:5 },
      ]},
    { name:'Sonder', displayName:'Sonder', element:Element.WATER, role:PetRole.HEALER, rarity:PetRarity.EPIC, isHigherForm:false, tier:'S+',
      baseAtk:38, baseDef:58, baseStamina:72, baseSpd:70, baseCrit:9,
      growthAtk:3.2, growthDef:5.2, growthStamina:7.2, growthSpd:6.0, growthCrit:0.35,
      description:'Versatile healer with targeted revive mechanic.',
      passive:'Empathy: When an ally drops below 30% HP, instantly heals them for 25% max HP.',
      tags:['healer','revive','support','water'],
      skills:[
        { name:'Ripple', type:SkillType.BASIC, description:'Water pulse', effect:'55% ATK water damage + heal 15% ATK as HP', cooldown:0 },
        { name:'Deep Understanding', type:SkillType.ACTIVE, description:'Big single heal', effect:'Heal one ally 150% DEF. Remove all negative effects', cooldown:3 },
        { name:'Profound Rest', type:SkillType.ULTIMATE, description:'AoE heal + barrier', effect:'Heal all allies 130% DEF. Apply 60% DEF barrier to all', cooldown:6 },
      ]},
    // S Tier
    { name:'Nostalgia', displayName:'Nostalgia', element:Element.WATER, role:PetRole.HEALER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S',
      baseAtk:45, baseDef:60, baseStamina:68, baseSpd:62, baseCrit:10,
      growthAtk:3.8, growthDef:5.5, growthStamina:6.8, growthSpd:5.2, growthCrit:0.4,
      description:'Passive turn-start healing for all allies. Warm Dream shields and boosts DEF.',
      passive:'Lingering Memory: All allies heal 6% max HP at start of each turn.',
      tags:['healer','regen','support','meta'],
      skills:[
        { name:'Memory Wave', type:SkillType.BASIC, description:'Soft water attack with heal', effect:'60% ATK water damage + heal lowest HP ally 20% DEF', cooldown:0 },
        { name:'Warm Dream', type:SkillType.ACTIVE, description:'Shield + DEF buff all', effect:'Shield all allies 70% DEF. +20% DEF for 2 turns', cooldown:3 },
        { name:'Faded Glory', type:SkillType.ULTIMATE, description:'Full party restoration', effect:'Heal all allies 200% DEF. Dispel 2 debuffs from each ally', cooldown:6 },
      ]},
    { name:'Jealous', displayName:'Jealous', element:Element.WOOD, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S',
      baseAtk:78, baseDef:42, baseStamina:52, baseSpd:74, baseCrit:17,
      growthAtk:7.8, growthDef:3.8, growthStamina:5.0, growthSpd:6.4, growthCrit:0.68,
      description:'Copies enemy buffs and turns them into damage. Strong in late dungeon.',
      passive:'Green Eyes: When an enemy uses a buff, Jealous gains 10% ATK for that turn.',
      tags:['fighter','wood','buff-steal','pvp'],
      skills:[
        { name:'Envy Cut', type:SkillType.BASIC, description:'Wood attack', effect:'90% ATK wood damage', cooldown:0 },
        { name:'Covet', type:SkillType.ACTIVE, description:'Steal buff and deal damage', effect:'Steal 1 buff from target. Deal 140% ATK wood damage', cooldown:3 },
        { name:'Emerald Wrath', type:SkillType.ULTIMATE, description:'Massive wood burst', effect:'260% ATK wood damage. If target has buffs, +50% dmg', cooldown:5 },
      ]},
    { name:'Wrath', displayName:'Wrath', element:Element.FIRE, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S',
      baseAtk:88, baseDef:35, baseStamina:45, baseSpd:65, baseCrit:15,
      growthAtk:9.0, growthDef:3.0, growthStamina:4.0, growthSpd:5.5, growthCrit:0.6,
      description:'Explosive fire damage dealer. Supernova and Flame of Fury combos.',
      passive:'Rage: Each hit taken increases own ATK by 3% (max 5 stacks).',
      tags:['fire','aoe','burst','fighter','pve'],
      skills:[
        { name:'Rage Punch', type:SkillType.BASIC, description:'Heavy fire strike', effect:'110% ATK fire damage', cooldown:0 },
        { name:'Supernova', type:SkillType.ACTIVE, description:'All-enemy fire explosion', effect:'130% ATK fire damage to all enemies', cooldown:2 },
        { name:'Flame of Fury', type:SkillType.ULTIMATE, description:'Peak fire devastation', effect:'320% ATK fire damage to one enemy. All allies gain +20% ATK', cooldown:5 },
      ]},
    { name:'Greed', displayName:'Greed', element:Element.FIRE, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S',
      baseAtk:80, baseDef:40, baseStamina:50, baseSpd:66, baseCrit:16,
      growthAtk:8.0, growthDef:3.5, growthStamina:4.5, growthSpd:5.6, growthCrit:0.65,
      description:'Greedy damage absorber — heals from every kill.',
      passive:'Avarice: Restore 10% max HP whenever an enemy is defeated.',
      tags:['fire','sustain','fighter','boss'],
      skills:[
        { name:'Gold Rush', type:SkillType.BASIC, description:'Fire slam', effect:'100% ATK fire damage', cooldown:0 },
        { name:'Hoard', type:SkillType.ACTIVE, description:'Big hit + self-heal', effect:'170% ATK fire damage. Heal self 20% dmg dealt', cooldown:3 },
        { name:'Take It All', type:SkillType.ULTIMATE, description:'Massive fire cleave', effect:'240% ATK fire damage to all. Heal 15% dmg dealt per enemy hit', cooldown:5 },
      ]},
    { name:'Resistance', displayName:'Resistance', element:Element.EARTH, role:PetRole.TANK, rarity:PetRarity.EPIC, isHigherForm:false, tier:'S',
      baseAtk:42, baseDef:88, baseStamina:85, baseSpd:40, baseCrit:5,
      growthAtk:3.5, growthDef:9.0, growthStamina:8.5, growthSpd:3.0, growthCrit:0.2,
      description:'Massive DEF tank. Redirects all single-target attacks to itself.',
      passive:'Immovable: Reduces all damage received by 15%.',
      tags:['tank','earth','taunt','pvp','meta'],
      skills:[
        { name:'Guard Strike', type:SkillType.BASIC, description:'Earth attack while guarding', effect:'70% ATK earth damage. Gain 10% DEF until next turn', cooldown:0 },
        { name:'Iron Will', type:SkillType.ACTIVE, description:'Taunt + DEF buff', effect:'Force all enemies to target Resistance for 2 turns. +20% DEF', cooldown:3 },
        { name:'Earthwall Slam', type:SkillType.ULTIMATE, description:'Massive earth retaliation', effect:'200% DEF as earth damage to all. Absorb 50% of damage as shield', cooldown:5 },
      ]},
    { name:'Temperance', displayName:'Temperance', element:Element.WATER, role:PetRole.TANK, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S',
      baseAtk:38, baseDef:90, baseStamina:90, baseSpd:42, baseCrit:5,
      growthAtk:3.0, growthDef:9.5, growthStamina:9.0, growthSpd:3.2, growthCrit:0.2,
      description:'Exceptional water tank with HP restoration on block.',
      passive:'Balance: When blocking, restore 8% max HP.',
      tags:['tank','water','block','healing-tank'],
      skills:[
        { name:'Tide Block', type:SkillType.BASIC, description:'Block and counter', effect:'Block next hit. Counter for 60% ATK water damage', cooldown:0 },
        { name:'Calm Waters', type:SkillType.ACTIVE, description:'Team DEF buff + self heal', effect:'+25% DEF all allies 2 turns. Heal self 15% max HP', cooldown:3 },
        { name:'Great Flood', type:SkillType.ULTIMATE, description:'Flood all enemies', effect:'180% ATK water damage to all. Reduce enemy ATK 20% for 2 turns', cooldown:5 },
      ]},
    { name:'Sloth', displayName:'Sloth (HF)', element:Element.EARTH, role:PetRole.TANK, rarity:PetRarity.UBER, isHigherForm:true, tier:'S',
      baseAtk:35, baseDef:95, baseStamina:95, baseSpd:30, baseCrit:4,
      growthAtk:2.8, growthDef:9.8, growthStamina:9.5, growthSpd:2.0, growthCrit:0.15,
      description:'Nearly unkillable. Lowest SPD but highest durability in game.',
      passive:'Torpor: Reduces damage taken by 25% but acts last each round.',
      tags:['tank','earth','uber','pvp','unkillable'],
      skills:[
        { name:'Lazy Slam', type:SkillType.BASIC, description:'Slow but powerful', effect:'80% ATK earth damage', cooldown:0 },
        { name:'Burrow', type:SkillType.ACTIVE, description:'Become untargetable', effect:'Immune to damage this turn. Regenerate 20% max HP', cooldown:4 },
        { name:'Earth Collapse', type:SkillType.ULTIMATE, description:'Devastating earth quake', effect:'220% DEF as earth damage to all. Stun all enemies 1 turn', cooldown:6 },
      ]},
    { name:'Spite', displayName:'Spite', element:Element.METAL, role:PetRole.FIGHTER, rarity:PetRarity.RARE, isHigherForm:false, tier:'S',
      baseAtk:72, baseDef:35, baseStamina:42, baseSpd:78, baseCrit:22,
      growthAtk:7.5, growthDef:3.0, growthStamina:4.0, growthSpd:7.0, growthCrit:0.9,
      description:'Budget assassin. Backstab combos deal enormous damage vs isolated targets.',
      passive:'Early Advantage: +20% ATK in the first 2 turns of battle.',
      tags:['metal','assassin','early-game','crit'],
      skills:[
        { name:'Backstab', type:SkillType.BASIC, description:'Stealthy metal attack', effect:'100% ATK metal damage. Crit guaranteed if target is isolated', cooldown:0 },
        { name:'Shadow Step', type:SkillType.ACTIVE, description:'Dodge + reposition', effect:'Evade next attack. Next basic attack deals +50% dmg', cooldown:3 },
        { name:'Spite Fueled', type:SkillType.ULTIMATE, description:'Rage-fuelled burst', effect:'250% ATK metal damage. +30% dmg per debuff on target', cooldown:5 },
      ]},
    // A Tier
    { name:'Apathy', displayName:'Apathy', element:Element.EARTH, role:PetRole.FIGHTER, rarity:PetRarity.RARE, isHigherForm:false, tier:'A',
      baseAtk:70, baseDef:38, baseStamina:45, baseSpd:62, baseCrit:14,
      growthAtk:7.2, growthDef:3.4, growthStamina:4.3, growthSpd:5.4, growthCrit:0.58,
      description:'Solid earth fighter. Underrated rare-tier pick for early/mid game.',
      passive:'Indifference: Immune to ATK-reducing debuffs.',
      tags:['earth','fighter','budget','early-game'],
      skills:[
        { name:'Rock Smash', type:SkillType.BASIC, description:'Heavy earth strike', effect:'105% ATK earth damage', cooldown:0 },
        { name:'Don\'t Care', type:SkillType.ACTIVE, description:'High damage + self buff', effect:'155% ATK earth damage. Ignore debuffs this turn', cooldown:3 },
      ]},
    { name:'Diligence', displayName:'Diligence', element:Element.EARTH, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'A',
      baseAtk:76, baseDef:44, baseStamina:54, baseSpd:58, baseCrit:13,
      growthAtk:7.6, growthDef:4.0, growthStamina:5.2, growthSpd:5.0, growthCrit:0.52,
      description:'Consistent damage. Gets stronger each consecutive turn in battle.',
      passive:'Hard Work: ATK increases by 5% each turn (max 5 stacks).',
      tags:['earth','fighter','scaling','boss'],
      skills:[
        { name:'Steady Blow', type:SkillType.BASIC, description:'Reliable earth strike', effect:'100% ATK earth damage', cooldown:0 },
        { name:'Grind', type:SkillType.ACTIVE, description:'Building power strike', effect:'140% ATK earth damage. Gain Hard Work stack', cooldown:2 },
        { name:'Culmination', type:SkillType.ULTIMATE, description:'Unleash all stacks', effect:'200% ATK earth damage × (1 + 0.1 per Hard Work stack)', cooldown:5 },
      ]},
    { name:'Paranoia', displayName:'Paranoia', element:Element.METAL, role:PetRole.FIGHTER, rarity:PetRarity.EPIC, isHigherForm:false, tier:'A',
      baseAtk:74, baseDef:40, baseStamina:50, baseSpd:72, baseCrit:20,
      growthAtk:7.4, growthDef:3.6, growthStamina:4.8, growthSpd:6.2, growthCrit:0.8,
      description:'High Crit metal fighter. SPD + Crit synergy excels at speed builds.',
      passive:'On Edge: +10% Crit Rate when facing 2+ enemies.',
      tags:['metal','crit','speed','fighter'],
      skills:[
        { name:'Metal Edge', type:SkillType.BASIC, description:'Sharp metal strike', effect:'95% ATK metal damage, high crit', cooldown:0 },
        { name:'Hypervigilance', type:SkillType.ACTIVE, description:'Speed boost + crit strike', effect:'140% ATK metal damage. +15% SPD and +10% Crit this turn', cooldown:3 },
        { name:'Breakdown', type:SkillType.ULTIMATE, description:'Rapid metal barrage', effect:'3x 80% ATK metal damage. Each hit has +15% Crit', cooldown:5 },
      ]},
    { name:'Gluttony', displayName:'Gluttony', element:Element.EARTH, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'A',
      baseAtk:82, baseDef:42, baseStamina:58, baseSpd:50, baseCrit:12,
      growthAtk:8.5, growthDef:3.8, growthStamina:5.5, growthSpd:4.2, growthCrit:0.48,
      description:'Devours enemies — gains permanent stat buffs from defeating foes.',
      passive:'Consume: Permanently gain +3% ATK whenever an enemy is defeated.',
      tags:['earth','fighter','stacking','pve'],
      skills:[
        { name:'Devour', type:SkillType.BASIC, description:'Earth chomp attack', effect:'110% ATK earth damage', cooldown:0 },
        { name:'Feast', type:SkillType.ACTIVE, description:'Heavy hit + sustain', effect:'170% ATK earth damage. Heal 25% damage dealt', cooldown:3 },
        { name:'Binge', type:SkillType.ULTIMATE, description:'Mass consumption', effect:'150% ATK earth damage to all. Heal 20% of total damage dealt', cooldown:5 },
      ]},
    { name:'Mischief', displayName:'Mischief', element:Element.WOOD, role:PetRole.FIGHTER, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'A',
      baseAtk:72, baseDef:44, baseStamina:52, baseSpd:70, baseCrit:16,
      growthAtk:7.2, growthDef:4.0, growthStamina:5.0, growthSpd:6.0, growthCrit:0.65,
      description:'Unique copycat mechanic — copies enemy passives temporarily.',
      passive:'Copycat: At battle start, copy the passive of the strongest enemy.',
      tags:['wood','fighter','unique','meta','adaptive'],
      skills:[
        { name:'Prank', type:SkillType.BASIC, description:'Tricky wood hit', effect:'90% ATK wood damage', cooldown:0 },
        { name:'Mirror', type:SkillType.ACTIVE, description:'Copy and amplify', effect:'Use a copy of target\'s last skill at 120% power', cooldown:4 },
        { name:'Chaos', type:SkillType.ULTIMATE, description:'Unpredictable burst', effect:'Random element, 240% ATK damage. Copies active buffs from enemy', cooldown:5 },
      ]},
    // B Tier (filling out the roster)
    { name:'Lonely', displayName:'Lonely', element:Element.WATER, role:PetRole.HEALER, rarity:PetRarity.RARE, isHigherForm:false, tier:'B',
      baseAtk:30, baseDef:48, baseStamina:60, baseSpd:58, baseCrit:7,
      growthAtk:2.5, growthDef:4.5, growthStamina:6.0, growthSpd:5.0, growthCrit:0.28,
      description:'Beginner healer. Easily replaced by Merry or Sonder.',
      passive:'Isolation Heal: +15% heal power when only 1 ally remains.',
      tags:['healer','water','early-game','starter'],
      skills:[
        { name:'Mist Spray', type:SkillType.BASIC, description:'Light water heal-attack', effect:'50% ATK water + heal self 10% ATK', cooldown:0 },
        { name:'Comfort', type:SkillType.ACTIVE, description:'Single target heal', effect:'Heal one ally 100% DEF', cooldown:2 },
      ]},
    { name:'Rejection', displayName:'Rejection', element:Element.WATER, role:PetRole.TANK, rarity:PetRarity.RARE, isHigherForm:false, tier:'B',
      baseAtk:45, baseDef:72, baseStamina:78, baseSpd:38, baseCrit:6,
      growthAtk:3.8, growthDef:7.5, growthStamina:7.8, growthSpd:3.0, growthCrit:0.24,
      description:'Early game tank with lifesteal and stun. Good beginner option.',
      passive:'Resilience: Regenerate 20% max HP at start of each turn.',
      tags:['tank','water','early-game','stun'],
      skills:[
        { name:'Hydro Gulp', type:SkillType.BASIC, description:'Lifesteal water hit', effect:'80% ATK water damage. Heal self 30% dmg dealt', cooldown:0 },
        { name:'Cold Shoulder', type:SkillType.ACTIVE, description:'Stun single enemy', effect:'Stun target 1 turn. Deal 100% ATK water damage', cooldown:3 },
        { name:'Wall Off', type:SkillType.ULTIMATE, description:'Reduce all enemy ATK', effect:'Reduce all enemy ATK by 25% for 2 turns', cooldown:5 },
      ]},
    { name:'Determination', displayName:'Determination', element:Element.FIRE, role:PetRole.TANK, rarity:PetRarity.EPIC, isHigherForm:false, tier:'A',
      baseAtk:48, baseDef:82, baseStamina:82, baseSpd:44, baseCrit:6,
      growthAtk:4.0, growthDef:8.5, growthStamina:8.2, growthSpd:3.5, growthCrit:0.25,
      description:'Fire tank that turns damage into power. Counterattacks when hit.',
      passive:'Never Give Up: When HP falls below 25%, gain +30% ATK and DEF for 2 turns.',
      tags:['fire','tank','clutch','counter'],
      skills:[
        { name:'Flame Guard', type:SkillType.BASIC, description:'Block + fire counter', effect:'Guard stance. Counter for 75% ATK fire damage', cooldown:0 },
        { name:'Rising Phoenix', type:SkillType.ACTIVE, description:'Big counter hit', effect:'180% ATK fire damage. Heals 15% max HP', cooldown:3 },
        { name:'Indomitable', type:SkillType.ULTIMATE, description:'Survive and retaliate', effect:'Become immune 1 turn. Then deal 250% ATK fire damage', cooldown:6 },
      ]},
    { name:'Petulance', displayName:'Petulance', element:Element.WOOD, role:PetRole.TANK, rarity:PetRarity.LEGENDARY, isHigherForm:false, tier:'S',
      baseAtk:40, baseDef:86, baseStamina:88, baseSpd:46, baseCrit:5,
      growthAtk:3.3, growthDef:8.8, growthStamina:8.8, growthSpd:3.8, growthCrit:0.2,
      description:'Wood tank. Throws tantrums to deal area damage when provoked.',
      passive:'Tantrum: When hit by a critical strike, deal 60% ATK wood damage to all enemies.',
      tags:['wood','tank','aoe','reactive'],
      skills:[
        { name:'Stomp', type:SkillType.BASIC, description:'Loud wood stomp', effect:'75% ATK wood damage to all enemies', cooldown:0 },
        { name:'Fit', type:SkillType.ACTIVE, description:'Taunt + wood AoE', effect:'Force all attacks on Petulance 2 turns. +30% DEF', cooldown:3 },
        { name:'Meltdown', type:SkillType.ULTIMATE, description:'Full power tantrum', effect:'160% ATK wood damage to all. Stun all 1 turn', cooldown:6 },
      ]},
  ];

  for (const p of pets) {
    const { skills, ...petData } = p;
    const tierSource = 'Pocket Gamer May 2026';
    await prisma.voidPet.create({
      data: { ...petData, tierSource, imageUrl: `/pets/${p.name.toLowerCase().replace(/[^a-z]/g,'')}.webp`,
        skills: { create: skills.map(s => ({ name:s.name, type:s.type, description:s.description, effect:s.effect, cooldown:s.cooldown??0 })) } }
    });
  }
  console.log(`✅ Created ${pets.length} pets`);

  // Gear items (real items from boss drop guides)
  const gear = [
    // HEAD items
    { name:'Silk Top Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Galax', bonusAtk:12, bonusCrit:8, floorRequired:50 },
    { name:'Pirate Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Krakoth', bonusAtk:14, bonusStamina:10, floorRequired:100 },
    { name:'Floral Crochet Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Vulko', bonusDef:14, bonusStamina:12, floorRequired:150 },
    { name:'Chef Hat', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Harold', bonusStamina:14, bonusSpd:8, floorRequired:10 },
    { name:'Cowboy Hat', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Harold', bonusStamina:10, bonusDef:10, floorRequired:10 },
    { name:'Icy Tiara', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Harold', bonusDef:8, bonusSpd:10, floorRequired:15 },
    { name:'Blue Palm Cap', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Harold', bonusDef:10, bonusSpd:8, floorRequired:15 },
    { name:'Purple Beanie', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Krakoth', bonusCrit:10, bonusDef:8, floorRequired:100 },
    { name:'Red Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Krakoth', bonusCrit:12, bonusStamina:8, floorRequired:100 },
    { name:'Bejeweled Cowboy Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Voidweaver', bonusStamina:12, bonusDef:10, floorRequired:200 },
    { name:'Ice Cream Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Voidweaver', bonusAtk:10, bonusSpd:12, floorRequired:200 },
    { name:'Top Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Voidweaver', bonusStamina:14, bonusAtk:8, floorRequired:200 },
    { name:'Spider Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Voidweaver', bonusCrit:10, bonusAtk:10, floorRequired:200 },
    { name:'Yellow Palm Cap', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Galax', bonusSpd:10, bonusCrit:8, floorRequired:50 },
    { name:'Coral Sun Hat', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Galax', bonusStamina:10, bonusSpd:10, floorRequired:50 },
    { name:'Cake Hat', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Galax', bonusDef:10, bonusSpd:8, floorRequired:50 },
    { name:'Hibiscus Flower', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Vulko', bonusAtk:10, bonusSpd:8, floorRequired:150 },
    { name:'Wizard Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Vulko', bonusAtk:10, bonusDef:10, floorRequired:150 },
    { name:'Pinwheel Hat', slot:GearSlot.HEAD, rarity:GearRarity.EPIC, source:'Shift', bonusCrit:12, bonusSpd:8, floorRequired:250 },
    { name:'Void Crown', slot:GearSlot.HEAD, rarity:GearRarity.LEGENDARY, source:'Quasar', bonusDef:18, bonusStamina:18, floorRequired:310,
      specialPassive:'Void Resilience: Reduce incoming damage by 8%.' },
    { name:'Storm Visor', slot:GearSlot.HEAD, rarity:GearRarity.LEGENDARY, source:'Shift', bonusAtk:16, bonusCrit:14, floorRequired:310,
      specialPassive:'Critical Eye: Crits deal an additional 15% bonus damage.' },
    { name:'Karen Hair', slot:GearSlot.HEAD, rarity:GearRarity.RARE, source:'Krakoth', bonusDef:10, bonusStamina:10, floorRequired:100 },
    // NECK items
    { name:'Aqua Spiked Collar', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Galax', bonusCrit:10, bonusSpd:10, floorRequired:50 },
    { name:'Wizard Cape', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Krakoth', bonusAtk:14, bonusSpd:8, floorRequired:100 },
    { name:'Bubblegum Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Harold', bonusSpd:10, bonusStamina:10, floorRequired:10 },
    { name:'Jellyfish Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Harold', bonusAtk:10, bonusStamina:10, floorRequired:10 },
    { name:'Cowboy Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Harold', bonusStamina:10, bonusDef:10, floorRequired:10 },
    { name:'Hibiscus Chain', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Harold', bonusSpd:10, bonusAtk:8, floorRequired:10 },
    { name:'Anxiety Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Galax', bonusSpd:12, bonusAtk:8, floorRequired:50 },
    { name:'Angry Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Galax', bonusAtk:12, bonusCrit:8, floorRequired:50 },
    { name:'Warm Pink Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Galax', bonusStamina:12, bonusSpd:8, floorRequired:50 },
    { name:'Blue Tie', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Krakoth', bonusCrit:12, bonusSpd:8, floorRequired:100 },
    { name:'Gold Diamond Necklace', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Krakoth', bonusCrit:10, bonusDef:10, floorRequired:100 },
    { name:'Pink Spiked Collar', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Krakoth', bonusCrit:10, bonusStamina:10, floorRequired:100 },
    { name:'Envious Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Vulko', bonusCrit:8, bonusDef:10, floorRequired:150 },
    { name:'Cake Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Vulko', bonusAtk:10, bonusDef:10, floorRequired:150 },
    { name:'Spider Necklace', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Voidweaver', bonusCrit:12, bonusAtk:8, floorRequired:200 },
    { name:'Chunky Knit Scarf', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Voidweaver', bonusStamina:12, bonusAtk:10, floorRequired:200 },
    { name:'Lemon Dolphin Float', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Voidweaver', bonusSpd:12, bonusStamina:10, floorRequired:200 },
    { name:'Watermelon Spiked Collar', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Shift', bonusCrit:12, bonusSpd:10, floorRequired:250 },
    { name:'Serpent Scarf', slot:GearSlot.NECK, rarity:GearRarity.EPIC, source:'Shift', bonusCrit:10, bonusStamina:10, floorRequired:250 },
    { name:'Void Chain', slot:GearSlot.NECK, rarity:GearRarity.LEGENDARY, source:'Quasar', bonusAtk:18, bonusDef:14, floorRequired:310,
      specialPassive:'Power Aura: +10% ATK to all allies at battle start.' },
    { name:'Fall Camel Scarf', slot:GearSlot.NECK, rarity:GearRarity.RARE, source:'Shift', bonusDef:10, bonusSpd:10, floorRequired:250 },
    // TRINKETS
    { name:'Nail Buffers', slot:GearSlot.TRINKET1, rarity:GearRarity.NORMAL, source:'Harold', bonusAtk:8, floorRequired:1 },
    { name:'Fluffy Pillow', slot:GearSlot.TRINKET1, rarity:GearRarity.NORMAL, source:'Harold', bonusStamina:12, floorRequired:1 },
    { name:'Lychee Candle', slot:GearSlot.TRINKET1, rarity:GearRarity.RARE, source:'Galax', bonusSpd:12, floorRequired:50 },
    { name:'Yoga Mat', slot:GearSlot.TRINKET1, rarity:GearRarity.RARE, source:'Galax', bonusStamina:14, floorRequired:50 },
    { name:'Espresso Shot', slot:GearSlot.TRINKET1, rarity:GearRarity.RARE, source:'Krakoth', bonusSpd:14, floorRequired:100 },
    { name:'Weighted Blanket', slot:GearSlot.TRINKET1, rarity:GearRarity.RARE, source:'Krakoth', bonusDef:14, floorRequired:100 },
    { name:'Stress Ball', slot:GearSlot.TRINKET1, rarity:GearRarity.RARE, source:'Vulko', bonusCrit:12, floorRequired:150 },
    { name:'Soft Dumbbell', slot:GearSlot.TRINKET1, rarity:GearRarity.RARE, source:'Vulko', bonusAtk:12, floorRequired:150 },
    { name:'Crit Stone', slot:GearSlot.TRINKET1, rarity:GearRarity.EPIC, source:'Shift', bonusCrit:16, floorRequired:250 },
    { name:'Void Shard', slot:GearSlot.TRINKET1, rarity:GearRarity.LEGENDARY, source:'Quasar', bonusAtk:14, bonusCrit:10, floorRequired:310,
      specialPassive:'Void Infusion: First attack each battle deals +25% damage.' },
    { name:'Speed Crystal', slot:GearSlot.TRINKET2, rarity:GearRarity.EPIC, source:'Shift', bonusSpd:16, floorRequired:250 },
    { name:'Tank Token', slot:GearSlot.TRINKET2, rarity:GearRarity.EPIC, source:'Quasar', bonusDef:16, bonusStamina:10, floorRequired:280 },
    { name:'Battle Badge', slot:GearSlot.TRINKET2, rarity:GearRarity.EPIC, source:'Bogar', bonusAtk:14, floorRequired:50 },
    { name:'Lucky Charm', slot:GearSlot.TRINKET2, rarity:GearRarity.RARE, source:'Harold', bonusCrit:10, floorRequired:20 },
    { name:'Iron Token', slot:GearSlot.TRINKET2, rarity:GearRarity.NORMAL, source:'Harold', bonusDef:10, floorRequired:1 },
    { name:'Void Core', slot:GearSlot.TRINKET2, rarity:GearRarity.LEGENDARY, source:'Quasar', bonusAtk:12, bonusSpd:12, floorRequired:310,
      specialPassive:'Core Surge: After using an Ultimate, gain +20% ATK for 2 turns.' },
  ];

  await prisma.gearItem.createMany({ data: gear.map(g => ({
    ...g, bonusAtk:g.bonusAtk??0, bonusDef:g.bonusDef??0,
    bonusStamina:g.bonusStamina??0, bonusSpd:g.bonusSpd??0, bonusCrit:g.bonusCrit??0,
    imageUrl:`/gear/${g.name.toLowerCase().replace(/[^a-z0-9]/g,'-')}.webp`,
  }))});
  console.log(`✅ Created ${gear.length} gear items`);

  // Sample Reddit posts
  await prisma.redditPost.createMany({ data: [
    { redditId:'abc1', title:'Lust HF build guide - clearing floor 800+', body:'Run Silk Top Hat + Aqua Spiked Collar + Crit Stone + Speed Crystal for maximum crit-speed. Absolute monster.', author:'VoidMaster', score:1240, url:'https://reddit.com/r/VoidpetDungeon/abc1', petMentions:['Lust'], sentiment:0.92, keyPhrases:['lust hf','crit','speed','floor 800'], patchVersion:'5.25.8', createdAt:new Date('2026-04-20'), fetchedAt:new Date() },
    { redditId:'abc2', title:'Merry is the best healer change my mind', body:'Ding Dong is broken. Combine with Storm Visor for the extra crit and watch your whole team mow everything down.', author:'HealerMain99', score:890, url:'https://reddit.com/r/VoidpetDungeon/abc2', petMentions:['Merry'], sentiment:0.88, keyPhrases:['merry','healer','ding dong','meta'], patchVersion:'5.25.8', createdAt:new Date('2026-04-25'), fetchedAt:new Date() },
    { redditId:'abc3', title:'Resistance tank build - PvP meta breakdown', body:'Resistance with Floral Crochet Hat + Void Chain + Tank Token makes it nearly unkillable. Pairs with Merry for unstoppable duo.', author:'TankGod', score:654, url:'https://reddit.com/r/VoidpetDungeon/abc3', petMentions:['Resistance','Merry'], sentiment:0.82, keyPhrases:['resistance','tank','pvp','floral'], patchVersion:'5.25.8', createdAt:new Date('2026-05-01'), fetchedAt:new Date() },
    { redditId:'abc4', title:'Down Bad speed build floors 400-600', body:'Yellow Palm Cap + Anxiety Scarf + Lychee Candle + Espresso Shot. You go first literally every single turn. Pairs great with Persistence.', author:'SpeedRunner', score:445, url:'https://reddit.com/r/VoidpetDungeon/abc4', petMentions:['Down Bad','Persistence'], sentiment:0.79, keyPhrases:['down bad','speed','floor 400','first turn'], patchVersion:'5.25.8', createdAt:new Date('2026-05-03'), fetchedAt:new Date() },
    { redditId:'abc5', title:'Spite is secretly S tier - budget assassin guide', body:'Spite with Watermelon Spiked Collar + Storm Visor crits basically every hit in the first two turns. Early Advantage passive is insane.', author:'BudgetPlayer', score:322, url:'https://reddit.com/r/VoidpetDungeon/abc5', petMentions:['Spite'], sentiment:0.75, keyPhrases:['spite','crit','budget','assassin'], patchVersion:'5.25.8', createdAt:new Date('2026-05-05'), fetchedAt:new Date() },
  ]});
  console.log('✅ Created Reddit posts');
  console.log('\n✨ Seed complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
