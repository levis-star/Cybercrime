import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const now = () => new Date().toISOString();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.resolve(__dirname, 'database.json');
const provider = process.env.DATA_PROVIDER || 'local-json';

function seedData() {
  return {
    users: [
      {
        id: 'usr_admin',
        fullName: 'System Administrator',
        phone: '+255700000001',
        email: 'admin@cybercrime.go.tz',
        passwordHash: bcrypt.hashSync('Admin123!', 10),
        role: 'admin',
        languagePreference: 'en',
        verifiedStatus: 'verified',
        createdAt: now()
      },
      {
        id: 'usr_analyst',
        fullName: 'Cybercrime Analyst',
        phone: '+255700000002',
        email: 'analyst@cybercrime.go.tz',
        passwordHash: bcrypt.hashSync('Analyst123!', 10),
        role: 'analyst',
        languagePreference: 'sw',
        verifiedStatus: 'verified',
        createdAt: now()
      }
    ],
    reports: [],
    evidence: [],
    alerts: [
      {
        id: 'alt_1',
        title: 'Mobile Money OTP Scam',
        content: 'Do not share one-time passwords with callers claiming to be agents.',
        language: 'en',
        targetRegion: 'National',
        severityLevel: 'high',
        createdBy: 'usr_admin',
        createdAt: now()
      },
      {
        id: 'alt_2',
        title: 'Tahadhari: Ajira Bandia',
        content: 'Usitume ada ya usaili kwa namba binafsi bila kuthibitisha tangazo.',
        language: 'sw',
        targetRegion: 'National',
        severityLevel: 'medium',
        createdBy: 'usr_admin',
        createdAt: now()
      }
    ],
    awarenessContent: [
      {
        id: 'awr_1',
        category: 'mobile-money',
        language: 'en',
        title: 'Protect your mobile money wallet',
        content:
          'Mobile money fraud often begins with pressure, fear, or a promise of quick benefit. Never share your PIN, OTP, account balance, national ID number, or SIM registration details with a caller, even if the caller says they work for a telecom company, bank, police unit, or government office. A real officer or provider should not ask you to reveal secret codes.',
        steps: [
          'Confirm official numbers using the provider website, app, or customer care line printed on trusted materials.',
          'If you receive a suspicious call, end the call, take note of the number, time, and what was requested.',
          'If money has been taken, contact your provider immediately, preserve transaction messages, and submit a report with screenshots or SMS references.'
        ],
        publishedAt: now()
      },
      {
        id: 'awr_2',
        category: 'mobile-money',
        language: 'sw',
        title: 'Linda akaunti yako ya fedha kwa simu',
        content:
          'Utapeli wa fedha kwa simu mara nyingi huanza kwa kukutisha, kukuahidi zawadi, au kukuambia uchukue hatua haraka. Usitoe PIN, OTP, salio, namba ya kitambulisho, au taarifa za usajili wa laini kwa mtu anayepiga simu, hata akisema anatoka kampuni ya simu, benki, polisi, au ofisi ya serikali.',
        steps: [
          'Thibitisha namba rasmi kupitia tovuti, programu, au huduma kwa wateja ya mtoa huduma wako.',
          'Ukipokea simu ya kutiliwa shaka, kata simu, hifadhi namba, muda, na maelezo aliyotaka.',
          'Kama fedha zimechukuliwa, wasiliana na mtoa huduma haraka, hifadhi SMS za miamala, na tuma ripoti yenye ushahidi.'
        ],
        publishedAt: now()
      },
      {
        id: 'awr_3',
        category: 'phishing',
        language: 'en',
        title: 'How to identify phishing messages',
        content:
          'Phishing messages try to steal passwords, payment details, or private documents by pretending to be a trusted organization. Look carefully at links, spelling, urgency, and requests for confidential information. If a message says your account will be closed unless you click immediately, slow down and verify it through a separate official channel.',
        steps: [
          'Do not open links from unknown senders or shortened links that hide the real website.',
          'Check whether the website address uses the correct domain and secure HTTPS connection.',
          'Report the message with screenshots, sender details, link address, and any money or data lost.'
        ],
        publishedAt: now()
      },
      {
        id: 'awr_4',
        category: 'reporting',
        language: 'en',
        title: 'How to prepare a useful cybercrime report',
        content:
          'A good report helps investigators understand what happened without exposing unnecessary private information. Describe the incident in the order it happened, include dates and times, and attach only relevant evidence. Avoid editing screenshots because original messages, phone numbers, usernames, links, and transaction IDs are often important.',
        steps: [
          'Write a short timeline: first contact, request made by the suspect, payment or data shared, and discovery of the offense.',
          'Save screenshots, receipts, phone numbers, user profiles, email headers, web links, and transaction references.',
          'Do not threaten the suspect or delete conversations before preserving evidence.'
        ],
        publishedAt: now()
      },
      {
        id: 'awr_5',
        category: 'reporting',
        language: 'sw',
        title: 'Namna ya kuandaa ripoti nzuri ya uhalifu mtandao',
        content:
          'Ripoti nzuri husaidia wachunguzi kuelewa kilichotokea bila kuweka taarifa zako binafsi zisizohitajika. Eleza tukio kwa mpangilio wa muda, weka tarehe na saa, na ambatanisha ushahidi muhimu tu. Usihariri picha za skrini kwa sababu ujumbe halisi, namba, majina ya akaunti, viungo, na kumbukumbu za miamala ni muhimu.',
        steps: [
          'Andika mlolongo mfupi: mawasiliano ya kwanza, ombi la mtuhumiwa, malipo au taarifa ulizotoa, na ulivyogundua kosa.',
          'Hifadhi picha za skrini, risiti, namba za simu, wasifu wa akaunti, barua pepe, viungo, na kumbukumbu za miamala.',
          'Usimtishe mtuhumiwa wala kufuta mazungumzo kabla ya kuhifadhi ushahidi.'
        ],
        publishedAt: now()
      }
    ],
    auditLogs: []
  };
}

const database = {
  meta: {
    provider,
    databasePath,
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    initializedAt: now()
  },
  ...seedData()
};

let firestore = null;

function ensureLocalDatabase() {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify({ meta: database.meta, ...seedData() }, null, 2));
  }
}

function loadLocalDatabase() {
  ensureLocalDatabase();
  const local = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
  Object.assign(database, local);
}

function persistLocal() {
  if (database.meta.provider !== 'local-json') return;
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
}

function normalizePrivateKey(value) {
  return value?.replace(/\\n/g, '\n');
}

async function connectFirebase() {
  const [{ cert, getApps, initializeApp }, { getFirestore }] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/firestore')
  ]);

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase is selected but FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY is missing.');
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey })
    });
  }

  firestore = getFirestore();
  database.meta.provider = 'firebase-firestore';
  database.meta.projectId = projectId;
  database.meta.databasePath = `projects/${projectId}/databases/(default)`;

  await seedFirebaseIfNeeded();
  await refreshFirebaseCache();
}

async function seedFirebaseIfNeeded() {
  const seeds = seedData();
  await seedCollection('users', seeds.users);
  await seedCollection('alerts', seeds.alerts);
  await seedCollection('awarenessContent', seeds.awarenessContent);
}

async function seedCollection(collectionName, records) {
  const snapshot = await firestore.collection(collectionName).limit(1).get();
  if (!snapshot.empty) return;
  const batch = firestore.batch();
  records.forEach((record) => {
    batch.set(firestore.collection(collectionName).doc(record.id), record);
  });
  await batch.commit();
}

async function loadCollection(collectionName) {
  const snapshot = await firestore.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function refreshFirebaseCache() {
  const [users, reports, evidence, alerts, awarenessContent, auditLogs] = await Promise.all([
    loadCollection('users'),
    loadCollection('reports'),
    loadCollection('evidence'),
    loadCollection('alerts'),
    loadCollection('awarenessContent'),
    loadCollection('auditLogs')
  ]);

  database.users = users;
  database.reports = reports.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  database.evidence = evidence;
  database.alerts = alerts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  database.awarenessContent = awarenessContent.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  database.auditLogs = auditLogs.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

async function saveFirebase(collectionName, record) {
  await firestore.collection(collectionName).doc(record.id).set(record, { merge: true });
}

async function persistRecord(collectionName, record) {
  if (database.meta.provider === 'firebase-firestore') {
    await saveFirebase(collectionName, record);
    return;
  }
  persistLocal();
}

function nextReportNumber() {
  const existing = database.reports
    .map((report) => Number(String(report.trackingCode).split('-').at(-1)))
    .filter((value) => Number.isFinite(value));
  return Math.max(0, ...existing) + 1;
}

function trackingCode() {
  const year = new Date().getFullYear();
  return `TZ-CC-${year}-${String(nextReportNumber()).padStart(4, '0')}`;
}

function scoreSeverity(payload) {
  const text = `${payload.category} ${payload.description}`.toLowerCase();
  let score = 30;
  if (text.includes('money') || text.includes('financial') || text.includes('sim')) score += 25;
  if (text.includes('otp') || text.includes('password') || text.includes('identity')) score += 20;
  if (payload.hasEvidence) score += 10;
  if (payload.anonymityStatus === 'verified') score += 5;
  return Math.min(score, 100);
}

if (provider === 'firebase') {
  await connectFirebase();
} else {
  loadLocalDatabase();
}

export const store = {
  users: database.users,
  reports: database.reports,
  evidence: database.evidence,
  alerts: database.alerts,
  awarenessContent: database.awarenessContent,
  auditLogs: database.auditLogs,
  databaseStatus() {
    return {
      connected: true,
      provider: database.meta.provider,
      projectId: database.meta.projectId,
      databasePath: database.meta.databasePath,
      records: {
        users: database.users.length,
        reports: database.reports.length,
        evidence: database.evidence.length,
        alerts: database.alerts.length,
        awarenessContent: database.awarenessContent.length,
        auditLogs: database.auditLogs.length
      }
    };
  },
  findUserByEmail(email) {
    return database.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  },
  async createUser(input) {
    const user = {
      id: `usr_${nanoid(10)}`,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email.toLowerCase(),
      passwordHash: bcrypt.hashSync(input.password, 10),
      role: 'citizen',
      languagePreference: input.languagePreference || 'en',
      verifiedStatus: 'pending',
      createdAt: now()
    };
    database.users.push(user);
    await persistRecord('users', user);
    return user;
  },
  async createReport(input) {
    const report = {
      id: `rep_${nanoid(10)}`,
      trackingCode: trackingCode(),
      userId: input.userId || null,
      category: input.category,
      description: input.description,
      locationRegion: input.locationRegion,
      locationDistrict: input.locationDistrict || null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      anonymityStatus: input.anonymityStatus,
      verificationStatus: input.anonymityStatus === 'verified' ? 'pending' : 'unverified',
      severityScore: scoreSeverity(input),
      pythonSeverityScore: input.pythonSeverityScore ?? null,
      severityFlags: input.severityFlags ?? [],
      status: 'new',
      assignment: null,
      createdAt: now()
    };
    database.reports.unshift(report);
    await persistRecord('reports', report);
    return report;
  },
  async addEvidence(reportId, file) {
    const item = {
      id: `ev_${nanoid(10)}`,
      reportId,
      fileUrl: file.path,
      fileType: file.mimetype,
      uploadedAt: now()
    };
    database.evidence.push(item);
    await persistRecord('evidence', item);
    return item;
  },
  async addAlert(input, adminId) {
    const alert = {
      id: `alt_${nanoid(10)}`,
      ...input,
      createdBy: adminId,
      createdAt: now()
    };
    database.alerts.unshift(alert);
    await persistRecord('alerts', alert);
    return alert;
  },
  async updateReport(report, changes, adminId) {
    Object.assign(report, changes);
    await persistRecord('reports', report);
    await this.log(adminId, 'report_review', report.id);
    return report;
  },
  async assignReport(report, assignment, adminId) {
    report.assignment = { ...assignment, assignedAt: now(), assignedBy: adminId };
    report.status = report.status === 'new' ? 'under_review' : report.status;
    await persistRecord('reports', report);
    await this.log(adminId, 'case_assigned', report.id);
    return report;
  },
  async log(adminId, action, targetRecord) {
    const auditLog = {
      id: `log_${nanoid(10)}`,
      adminId,
      action,
      targetRecord,
      timestamp: now()
    };
    database.auditLogs.unshift(auditLog);
    await persistRecord('auditLogs', auditLog);
  }
};
