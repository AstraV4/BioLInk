// ---------------------------------------------------------------------------
// Base de donnees SQLite (aucun serveur DB externe a installer : un fichier)
// ---------------------------------------------------------------------------
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Dossier de donnees persistant. En local : le dossier du projet.
// Sur Railway : monte un volume et definis la variable DATA_DIR=/data
const DATA_DIR = process.env.DATA_DIR || __dirname;
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  username       TEXT UNIQUE NOT NULL,
  username_lower TEXT UNIQUE NOT NULL,
  password       TEXT NOT NULL,
  created_at     INTEGER NOT NULL,

  title       TEXT    DEFAULT '',
  bio         TEXT    DEFAULT '[]',          -- JSON: ["ligne 1","ligne 2"]
  avatar      TEXT    DEFAULT '',            -- chemin /uploads/...
  background  TEXT    DEFAULT '',            -- chemin /uploads/...
  bg_is_video INTEGER DEFAULT 0,
  song        TEXT    DEFAULT '',            -- chemin /uploads/...
  song_name   TEXT    DEFAULT '',

  accent   TEXT DEFAULT '#8b5cf6',
  accent2  TEXT DEFAULT '#22d3ee',
  effect   TEXT DEFAULT 'snow',             -- snow | rain | stars | none
  status   TEXT DEFAULT 'online',           -- online | idle | dnd | offline | ''
  cursor   INTEGER DEFAULT 1,

  socials  TEXT DEFAULT '[]',               -- JSON: [{"type":"discord","url":"..."}]
  buttons  TEXT DEFAULT '[]',               -- JSON: [{"label":"...","url":"..."}]

  views    INTEGER DEFAULT 0
);
`);

// Migrations (ajout de colonnes sur une base deja existante, sans rien casser)
const cols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
const addCol = (name, def) => { if (!cols.includes(name)) db.exec(`ALTER TABLE users ADD COLUMN ${name} ${def}`); };
addCol('song_art',      "TEXT DEFAULT ''");
addCol('timezone',      "TEXT DEFAULT ''");
addCol('skills',        "TEXT DEFAULT '[]'");
addCol('location',      "TEXT DEFAULT ''");
addCol('discord_guild', "TEXT DEFAULT ''");

module.exports = db;

