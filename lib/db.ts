import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { Campaign, TikToker, Vote, OtpRecord } from './types';

// Database path resolution with Vercel / serverless support
function getDatabasePath(): string {
  // Detect Vercel / AWS Lambda / serverless environment
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NOW_REGION) ||
    process.env.NODE_ENV === 'production';

  if (isServerless) {
    const tmpDir = process.env.TMPDIR || '/tmp';
    const tmpDbPath = path.join(tmpDir, 'orbit_voting.db');
    const sourceDbPath = path.join(process.cwd(), 'data', 'orbit_voting.db');

    // On cold start, copy the pre-seeded sqlite db to /tmp if it exists
    if (!fs.existsSync(tmpDbPath)) {
      try {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
      } catch (err) {
        console.warn('Could not copy bundled sqlite db to /tmp, initializing fresh in /tmp:', err);
      }
    }
    return tmpDbPath;
  }

  // Local development
  const localDataDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    return path.join(localDataDir, 'orbit_voting.db');
  } catch {
    const tmpDir = process.env.TMPDIR || '/tmp';
    return path.join(tmpDir, 'orbit_voting.db');
  }
}

// Global singleton pattern for Next.js hot-reloading
declare global {
  var __orbitDb: DatabaseSync | undefined;
}

function getDatabase(): DatabaseSync {
  if (!global.__orbitDb) {
    const dbPath = getDatabasePath();
    global.__orbitDb = new DatabaseSync(dbPath);
    initSchema(global.__orbitDb);
  }
  return global.__orbitDb;
}

function initSchema(db: DatabaseSync) {
  try {
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA synchronous = NORMAL;');
  } catch (e) {
    // Fallback if filesystem does not permit WAL
    try {
      db.exec('PRAGMA journal_mode = MEMORY;');
    } catch {}
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tiktokers (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      profile_image TEXT NOT NULL,
      bio TEXT NOT NULL,
      category TEXT NOT NULL,
      vote_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      tiktoker_id TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      ip_address TEXT,
      verified_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(campaign_id) REFERENCES campaigns(id),
      FOREIGN KEY(tiktoker_id) REFERENCES tiktokers(id)
    );

    CREATE TABLE IF NOT EXISTS otps (
      id TEXT PRIMARY KEY,
      phone_number TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      action TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      window_start TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_votes_phone_created ON votes(phone_number, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_votes_tiktoker ON votes(tiktoker_id);
    CREATE INDEX IF NOT EXISTS idx_votes_campaign ON votes(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone_number, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tiktokers_votes ON tiktokers(vote_count DESC);
  `);

  seedInitialData(db);
}

function seedInitialData(db: DatabaseSync) {
  // Check if campaign exists
  const campaignCountRow = db.prepare('SELECT COUNT(*) as count FROM campaigns').get() as { count: number };
  if (campaignCountRow.count === 0) {
    const now = new Date();
    // Start was 2 days ago, ends 5 days, 17 hours, 42 mins, 30 seconds from now
    const startAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const endAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const insertCampaign = db.prepare(`
      INSERT INTO campaigns (id, title, description, start_at, end_at, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCampaign.run(
      'orbit-tiktoker-2026',
      'Orbit Creative Challenge 2026',
      'Celebrate Ethiopia\'s premier creators. Cast your verified vote once every 24 hours in the Orbit Creative Challenge 2026.',
      startAt,
      endAt,
      'active',
      now.toISOString(),
      now.toISOString()
    );
  }

  // Check if tiktokers exist
  const tiktokerCountRow = db.prepare('SELECT COUNT(*) as count FROM tiktokers').get() as { count: number };
  if (tiktokerCountRow.count === 0) {
    const nowIso = new Date().toISOString();
    const creators = [
      {
        id: 'creator-1',
        full_name: 'Adonay Berhane',
        username: '@adonay_berhane',
        profile_image: '/creators/Adonay Berhane.jpg',
        bio: 'Viral comedy skits, street entertainment, and trending situational humor.',
        category: 'Entertainment',
        vote_count: 28492,
      },
      {
        id: 'creator-2',
        full_name: 'Bertemios',
        username: '@bertemios',
        profile_image: '/creators/Bertemios.jpeg',
        bio: 'Trending Addis lifestyle creator, social commentary, and popular culture.',
        category: 'Lifestyle',
        vote_count: 27150,
      },
      {
        id: 'creator-3',
        full_name: 'Dani Royal',
        username: '@dani_royal',
        profile_image: '/creators/Dani Royal.jpeg',
        bio: 'High-energy content, viral challenges, and creative entertainment.',
        category: 'Entertainment',
        vote_count: 24820,
      },
      {
        id: 'creator-4',
        full_name: 'Jon Daniel',
        username: '@jon_daniel',
        profile_image: '/creators/Jon Daniel.jpeg',
        bio: 'Standout comedic storytelling, relatable skits, and youth culture.',
        category: 'Comedy',
        vote_count: 22340,
      },
      {
        id: 'creator-5',
        full_name: 'Kidus Ephrem',
        username: '@kidus_ephrem',
        profile_image: '/creators/Kidus Ephrem.jpeg',
        bio: 'Fashion style inspiration, visual storytelling, and urban lifestyle.',
        category: 'Fashion',
        vote_count: 19780,
      },
      {
        id: 'creator-6',
        full_name: 'Lij Dawud',
        username: '@lij_dawud',
        profile_image: '/creators/Lij Dawud.jpeg',
        bio: 'Authentic cultural humor, trending dialogues, and creative perspective.',
        category: 'Culture',
        vote_count: 17920,
      },
      {
        id: 'creator-7',
        full_name: 'Maria Yoseph',
        username: '@maria_yoseph',
        profile_image: '/creators/Maria Yoseph.jpeg',
        bio: 'Creative beauty transformations, lifestyle vlogs, and trending videos.',
        category: 'Beauty & Lifestyle',
        vote_count: 15640,
      },
      {
        id: 'creator-8',
        full_name: 'Tonkosu',
        username: '@tonkosu',
        profile_image: '/creators/Tonkosu.jpeg',
        bio: 'Hilarious comedy sketches, viral character acting, and entertainment.',
        category: 'Comedy',
        vote_count: 14210,
      },
      {
        id: 'creator-9',
        full_name: 'Winta Zesu',
        username: '@winta_zesu',
        profile_image: '/creators/Winta Zesu.jpeg',
        bio: 'Choreography, trending dance hits, and energetic performance.',
        category: 'Performance',
        vote_count: 13890,
      },
      {
        id: 'creator-10',
        full_name: 'Yohanis Teshome',
        username: '@yohanis_teshome',
        profile_image: '/creators/Yohanis Teshome.jpeg',
        bio: 'High quality video production, cinematic trends, and creative media.',
        category: 'Media & Arts',
        vote_count: 12450,
      },
      {
        id: 'creator-11',
        full_name: 'Yuti Nass',
        username: '@yuti_nass',
        profile_image: '/creators/Yuti Nass.jpeg',
        bio: 'Modern music vibes, fashion trends, and lifestyle content.',
        category: 'Music & Style',
        vote_count: 11200,
      },
    ];

    const insertTiktoker = db.prepare(`
      INSERT INTO tiktokers (id, full_name, username, profile_image, bio, category, vote_count, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    for (const c of creators) {
      insertTiktoker.run(c.id, c.full_name, c.username, c.profile_image, c.bio, c.category, c.vote_count, nowIso, nowIso);
    }
  }
}

// Database helper functions

export function getActiveCampaign(): Campaign | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM campaigns WHERE status = 'active' LIMIT 1").get() as Campaign | undefined;
  if (!row) return null;

  // Ensure campaign remains open for voting
  if (new Date(row.end_at).getTime() <= Date.now()) {
    const futureEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("UPDATE campaigns SET end_at = ? WHERE id = ?").run(futureEnd, row.id);
    row.end_at = futureEnd;
  }

  return row;
}

export function getAllTikTokers(): TikToker[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM tiktokers WHERE is_active = 1 ORDER BY vote_count DESC').all() as unknown as TikToker[];
  return rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}

export function getTikTokerById(id: string): TikToker | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM tiktokers WHERE id = ?').get(id) as TikToker | undefined;
  return row || null;
}

export function getLatestVoteForPhone(phoneNumber: string): Vote | null {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT * FROM votes 
    WHERE phone_number = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(phoneNumber) as Vote | undefined;
  return row || null;
}

export function saveOtp(phoneNumber: string, otpCode: string, expiresInSeconds: number): string {
  const db = getDatabase();
  const id = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000).toISOString();

  const insert = db.prepare(`
    INSERT INTO otps (id, phone_number, otp_code, attempts, expires_at, verified, created_at)
    VALUES (?, ?, ?, 0, ?, 0, ?)
  `);

  insert.run(id, phoneNumber, otpCode, expiresAt, now.toISOString());
  return id;
}

export function getValidOtp(phoneNumber: string): OtpRecord | null {
  const db = getDatabase();
  const now = new Date().toISOString();
  const row = db.prepare(`
    SELECT * FROM otps 
    WHERE phone_number = ? AND verified = 0 AND expires_at > ?
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(phoneNumber, now) as OtpRecord | undefined;
  return row || null;
}

export function incrementOtpAttempts(otpId: string): void {
  const db = getDatabase();
  db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE id = ?').run(otpId);
}

export function checkRateLimit(identifier: string, action: string, maxCount: number, windowSeconds: number): boolean {
  const db = getDatabase();
  const now = Date.now();
  const windowStartThreshold = new Date(now - windowSeconds * 1000).toISOString();

  const row = db.prepare(`
    SELECT * FROM rate_limits 
    WHERE identifier = ? AND action = ? AND window_start > ?
  `).get(identifier, action, windowStartThreshold) as { id: string; count: number; window_start: string } | undefined;

  if (!row) {
    const id = `rl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.prepare(`
      INSERT INTO rate_limits (id, identifier, action, count, window_start)
      VALUES (?, ?, ?, 1, ?)
    `).run(id, identifier, action, new Date(now).toISOString());
    return true;
  }

  if (row.count >= maxCount) {
    return false;
  }

  db.prepare('UPDATE rate_limits SET count = count + 1 WHERE id = ?').run(row.id);
  return true;
}

/**
 * Executes an atomic vote transaction:
 * 1. Validates campaign status & end time
 * 2. Validates OTP and increments attempt count
 * 3. Enforces strict 24-hour phone cooldown
 * 4. Inserts vote record
 * 5. Increments TikToker vote count
 * 6. Marks OTP as verified
 */
export function executeVoteTransaction(params: {
  phoneNumber: string;
  otpCode: string;
  tiktokerId: string;
  ipAddress?: string;
}): {
  success: boolean;
  error?: string;
  voteId?: string;
  nextEligibleVoteAt?: string;
  cooldownSeconds?: number;
  newTotalVotes?: number;
  tiktoker?: TikToker;
  ranking?: number;
} {
  const db = getDatabase();
  const { phoneNumber, otpCode, tiktokerId, ipAddress } = params;
  const now = new Date();
  const nowIso = now.toISOString();

  // 1. Campaign Check
  const campaign = getActiveCampaign();
  if (!campaign) {
    return { success: false, error: 'Voting campaign is currently not active.' };
  }

  if (new Date(campaign.end_at).getTime() <= now.getTime()) {
    return { success: false, error: 'Voting has officially closed for this campaign.' };
  }

  // 2. TikToker Check
  const tiktoker = getTikTokerById(tiktokerId);
  if (!tiktoker || !tiktoker.is_active) {
    return { success: false, error: 'Selected creator is invalid or not participating.' };
  }

  // 3. OTP Check
  const otpRecord = getValidOtp(phoneNumber);
  if (!otpRecord) {
    return { success: false, error: 'Verification code has expired or was not requested. Please request a new OTP.' };
  }

  if (otpRecord.attempts >= 5) {
    return { success: false, error: 'Too many incorrect attempts. Please request a new verification code.' };
  }

  if (otpRecord.otp_code.trim() !== otpCode.trim()) {
    incrementOtpAttempts(otpRecord.id);
    const remainingAttempts = 4 - otpRecord.attempts;
    return { 
      success: false, 
      error: `Invalid verification code. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : 'Code locked. Please request a new one.'}` 
    };
  }

  // 4. Strict 24-Hour Cooldown Check on Backend
  const latestVote = getLatestVoteForPhone(phoneNumber);
  if (latestVote) {
    const lastVoteTime = new Date(latestVote.created_at).getTime();
    const cooldownMs = 24 * 60 * 60 * 1000;
    const diff = now.getTime() - lastVoteTime;

    if (diff < cooldownMs) {
      const remainingMs = cooldownMs - diff;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const nextEligibleAt = new Date(lastVoteTime + cooldownMs).toISOString();

      return {
        success: false,
        error: `This phone number has already voted in the last 24 hours. Next vote available at ${new Date(nextEligibleAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        nextEligibleVoteAt: nextEligibleAt,
        cooldownSeconds: remainingSeconds,
      };
    }
  }

  // 5. ATOMIC DB WRITE
  const voteId = `vote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const nextEligibleVoteAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  try {
    db.exec('BEGIN TRANSACTION;');

    // Mark OTP verified
    db.prepare('UPDATE otps SET verified = 1 WHERE id = ?').run(otpRecord.id);

    // Insert Vote
    db.prepare(`
      INSERT INTO votes (id, campaign_id, tiktoker_id, phone_number, ip_address, verified_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(voteId, campaign.id, tiktoker.id, phoneNumber, ipAddress || '127.0.0.1', nowIso, nowIso);

    // Increment TikToker votes
    db.prepare('UPDATE tiktokers SET vote_count = vote_count + 1, updated_at = ? WHERE id = ?').run(nowIso, tiktoker.id);

    db.exec('COMMIT;');
  } catch (err: any) {
    db.exec('ROLLBACK;');
    return { success: false, error: `Database transaction error: ${err?.message || 'Vote failed'}` };
  }

  // Retrieve updated creator & ranking
  const updatedTiktokers = getAllTikTokers();
  const updatedCreator = updatedTiktokers.find(t => t.id === tiktoker.id);
  const ranking = updatedTiktokers.findIndex(t => t.id === tiktoker.id) + 1;

  return {
    success: true,
    voteId,
    tiktoker: updatedCreator || tiktoker,
    nextEligibleVoteAt,
    cooldownSeconds: 24 * 60 * 60,
    newTotalVotes: updatedCreator ? updatedCreator.vote_count : tiktoker.vote_count + 1,
    ranking,
  };
}

export { getDatabase };
