import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_DIR = join(__dirname, '../../data');
const DB_PATH = join(DB_DIR, 'database.sqlite');

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Create projects table with all required fields
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('active', 'on_hold', 'completed')),
    start_date TEXT NOT NULL,
    end_date TEXT,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT
  )
`;

db.exec(createTableQuery);

// Create index for better query performance
db.exec('CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)');
db.exec('CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at)');

export default db;
