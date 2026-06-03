// ============================================================
// VOIDPET DUNGEON — Build Optimizer: Prisma Schema
// Reflects actual game: 4 gear slots, 5 elements, 3 roles
// ============================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Voidpets ─────────────────────────────────────────────────

model VoidPet {
  id             String      @id @default(cuid())
  name           String      @unique  // "Wrath", "Merry", "Lust"
  displayName    String                // "Lust (HF)" for uber forms
  element        Element
  role           PetRole
  rarity         PetRarity
  isHigherForm   Boolean     @default(false)
  baseOfId       String?               // parent pet ID if HF variant
  maxEvolution   Int         @default(5)
  description    String
  passive        String?
  tier           String      @default("B")  // S+, S, A, B, C, D
  tierSource     String      @default("community")
  tags           String[]
  imageUrl       String?

  // Base stats at evolution stage 1
  baseAtk        Float
  baseDef        Float
  baseStamina    Float
  baseSpd        Float
  baseCrit       Float

  // Growth per evolution stage
  growthAtk      Float
  growthDef      Float
  growthStamina  Float
  growthSpd      Float
  growthCrit     Float

  // Relations
  skills         Skill[]
  builds         Build[]
  metaEntries    MetaEntry[]
  communityMentions CommunityMention[]

  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  @@index([element])
  @@index([role])
  @@index([rarity])
  @@index([tier])
}

model Skill {
  id          String    @id @default(cuid())
  petId       String
  name        String
  description String
  type        SkillType
  cooldown    Int?
  effect      String

  pet         VoidPet   @relation(fields: [petId], references: [id], onDelete: Cascade)

  @@index([petId])
}

// ─── Gear ────────────────────────────────────────────────────

model GearItem {
  id              String      @id @default(cuid())
  name            String      @unique
  slot            GearSlot
  rarity          GearRarity
  source          String      // Boss name: "Harold", "Galax", etc.
  floorRequired   Int?
  specialPassive  String?     // Legendary/Uber passive text
  imageUrl        String?

  // Primary stats (nullable = 0 bonus)
  bonusAtk        Float       @default(0)
  bonusDef        Float       @default(0)
  bonusStamina    Float       @default(0)
  bonusSpd        Float       @default(0)
  bonusCrit       Float       @default(0)

  // Ascension — upgraded with Void Matter
  ascensionLevel  Int         @default(0)  // 0-5

  // Usage in builds
  buildsAsHead     Build[]    @relation("HeadGear")
  buildsAsNeck     Build[]    @relation("NeckGear")
  buildsAsTrinket1 Build[]    @relation("Trinket1Gear")
  buildsAsTrinket2 Build[]    @relation("Trinket2Gear")

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([slot])
  @@index([rarity])
  @@index([source])
}

// ─── Builds ──────────────────────────────────────────────────

model Build {
  id              String      @id @default(cuid())
  petId           String
  evolutionLevel  Int
  headGearId      String?
  neckGearId      String?
  trinket1Id      String?
  trinket2Id      String?

  // Computed
  finalAtk        Float
  finalDef        Float
  finalStamina    Float
  finalSpd        Float
  finalCrit       Float

  // Scores (0-100)
  scoreOverall    Float       @default(0)
  scoreOffense    Float       @default(0)
  scoreDefense    Float       @default(0)
  scoreUtility    Float       @default(0)
  scoreConfidence Float       @default(0)

  recommendedFor  String      @default("")
  notes           String?
  source          BuildSource @default(OPTIMIZER)
  patchVersion    String
  isOutdated      Boolean     @default(false)

  // Relations
  pet             VoidPet     @relation(fields: [petId], references: [id])
  headGear        GearItem?   @relation("HeadGear", fields: [headGearId], references: [id])
  neckGear        GearItem?   @relation("NeckGear", fields: [neckGearId], references: [id])
  trinket1        GearItem?   @relation("Trinket1Gear", fields: [trinket1Id], references: [id])
  trinket2        GearItem?   @relation("Trinket2Gear", fields: [trinket2Id], references: [id])
  metaEntry       MetaEntry?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([petId])
  @@index([scoreOverall])
  @@index([patchVersion])
}

// ─── Meta Scores ─────────────────────────────────────────────

model MetaEntry {
  id              String    @id @default(cuid())
  petId           String
  buildId         String?   @unique
  tier            String    // S+, S, A, B, C, D
  role            PetRole
  votes           Int       @default(0)
  communityNotes  String    @default("")
  mathScore       Float     @default(0)
  communityScore  Float     @default(0)
  patchFreshness  Float     @default(0)
  popularityScore Float     @default(0)
  confidenceTotal Float     @default(0)
  redditMentions  Int       @default(0)
  redditSentiment Float     @default(0)
  patchVersion    String
  isCurrentPatch  Boolean   @default(true)
  lastUpdated     DateTime  @default(now())

  pet             VoidPet   @relation(fields: [petId], references: [id])
  build           Build?    @relation(fields: [buildId], references: [id])

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([petId, role, patchVersion])
  @@index([petId])
  @@index([confidenceTotal])
}

// ─── Reddit / Community ──────────────────────────────────────

model RedditPost {
  id           String   @id @default(cuid())
  redditId     String   @unique
  title        String
  body         String   @db.Text
  author       String
  score        Int      @default(0)
  url          String
  petMentions  String[]
  sentiment    Float    @default(0)
  keyPhrases   String[]
  patchVersion String?
  createdAt    DateTime
  fetchedAt    DateTime @default(now())

  @@index([sentiment])
  @@index([patchVersion])
}

model CommunityMention {
  id             String   @id @default(cuid())
  petId          String
  gearCombo      String[] // gear names
  frequency      Int      @default(1)
  avgSentiment   Float    @default(0)
  patchVersion   String
  lastSeen       DateTime @default(now())

  pet            VoidPet  @relation(fields: [petId], references: [id])

  @@index([petId])
  @@index([frequency])
}

// ─── Patch Notes ─────────────────────────────────────────────

model PatchNote {
  id             String   @id @default(cuid())
  version        String   @unique
  releaseDate    DateTime
  title          String
  changes        Json     // PatchChange[]
  isCurrentPatch Boolean  @default(false)
  createdAt      DateTime @default(now())
}

// ─── Enums ───────────────────────────────────────────────────

enum Element {
  FIRE
  WATER
  WOOD
  EARTH
  METAL
}

enum PetRole {
  FIGHTER
  TANK
  HEALER
}

enum PetRarity {
  RARE
  EPIC
  LEGENDARY
  UBER
}

enum GearSlot {
  HEAD
  NECK
  TRINKET1
  TRINKET2
}

enum GearRarity {
  NORMAL
  RARE
  EPIC
  LEGENDARY
  UBER
}

enum SkillType {
  BASIC
  ACTIVE
  PASSIVE
  ULTIMATE
}

enum BuildSource {
  OPTIMIZER
  COMMUNITY
  REDDIT
  MANUAL
}
