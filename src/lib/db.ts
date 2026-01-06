import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Service, Subservice, ServiceWithSubservices } from './types';

const dbPath = process.env.DATABASE_PATH || './data/tss-wheel.db';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tooltip TEXT,
      description TEXT,
      color TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subservices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      tooltip TEXT,
      color TEXT NOT NULL,
      weight INTEGER NOT NULL DEFAULT 10,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_subservices_service_id ON subservices(service_id);
    CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
    CREATE INDEX IF NOT EXISTS idx_subservices_sort_order ON subservices(sort_order);
  `);
}

// Services CRUD
export function getAllServices(): Service[] {
  return db.prepare('SELECT * FROM services ORDER BY sort_order ASC, id ASC').all() as Service[];
}

export function getServiceById(id: number): Service | undefined {
  return db.prepare('SELECT * FROM services WHERE id = ?').get(id) as Service | undefined;
}

export function createService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Service {
  const stmt = db.prepare(`
    INSERT INTO services (name, tooltip, description, color, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(data.name, data.tooltip, data.description, data.color, data.sort_order);
  return getServiceById(result.lastInsertRowid as number)!;
}

export function updateService(id: number, data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Service | undefined {
  const fields = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ');
  const values = Object.keys(data).filter(k => k !== 'id').map(k => (data as any)[k]);

  if (fields.length === 0) return getServiceById(id);

  const stmt = db.prepare(`
    UPDATE services
    SET ${fields}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(...values, id);
  return getServiceById(id);
}

export function deleteService(id: number): void {
  db.prepare('DELETE FROM services WHERE id = ?').run(id);
}

// Subservices CRUD
export function getSubservicesByServiceId(serviceId: number): Subservice[] {
  return db.prepare('SELECT * FROM subservices WHERE service_id = ? ORDER BY sort_order ASC, id ASC')
    .all(serviceId) as Subservice[];
}

export function getSubserviceById(id: number): Subservice | undefined {
  return db.prepare('SELECT * FROM subservices WHERE id = ?').get(id) as Subservice | undefined;
}

export function createSubservice(data: Omit<Subservice, 'id' | 'created_at' | 'updated_at'>): Subservice {
  const stmt = db.prepare(`
    INSERT INTO subservices (service_id, name, tooltip, color, weight, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(data.service_id, data.name, data.tooltip, data.color, data.weight, data.sort_order);
  return getSubserviceById(result.lastInsertRowid as number)!;
}

export function updateSubservice(id: number, data: Partial<Omit<Subservice, 'id' | 'created_at' | 'updated_at'>>): Subservice | undefined {
  const fields = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = ?`).join(', ');
  const values = Object.keys(data).filter(k => k !== 'id').map(k => (data as any)[k]);

  if (fields.length === 0) return getSubserviceById(id);

  const stmt = db.prepare(`
    UPDATE subservices
    SET ${fields}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(...values, id);
  return getSubserviceById(id);
}

export function deleteSubservice(id: number): void {
  db.prepare('DELETE FROM subservices WHERE id = ?').run(id);
}

// Get full config
export function getFullConfig(): ServiceWithSubservices[] {
  const services = getAllServices();
  return services.map(service => ({
    ...service,
    subservices: getSubservicesByServiceId(service.id)
  }));
}

// Bulk operations
export function replaceAllData(services: Omit<ServiceWithSubservices, 'id' | 'created_at' | 'updated_at'>[]): void {
  const transaction = db.transaction(() => {
    db.prepare('DELETE FROM subservices').run();
    db.prepare('DELETE FROM services').run();

    services.forEach((service, idx) => {
      const newService = createService({
        name: service.name,
        tooltip: service.tooltip,
        description: service.description,
        color: service.color,
        sort_order: service.sort_order ?? idx
      });

      service.subservices.forEach((sub, subIdx) => {
        createSubservice({
          service_id: newService.id,
          name: sub.name,
          tooltip: sub.tooltip,
          color: sub.color,
          weight: sub.weight,
          sort_order: sub.sort_order ?? subIdx
        });
      });
    });
  });

  transaction();
}

export function reorderServices(ids: number[]): void {
  const stmt = db.prepare('UPDATE services SET sort_order = ? WHERE id = ?');
  const transaction = db.transaction(() => {
    ids.forEach((id, index) => {
      stmt.run(index, id);
    });
  });
  transaction();
}

export function reorderSubservices(ids: number[]): void {
  const stmt = db.prepare('UPDATE subservices SET sort_order = ? WHERE id = ?');
  const transaction = db.transaction(() => {
    ids.forEach((id, index) => {
      stmt.run(index, id);
    });
  });
  transaction();
}

export { db };
