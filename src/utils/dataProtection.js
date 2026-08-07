const SNAPSHOT_KEY = "ftos-protection-snapshots-v1";
const LAST_BACKUP_KEY = "ftos-protection-last-backup-v1";
const THROTTLE_KEY = "ftos-protection-last-auto-v1";
const MAX_SNAPSHOTS = 8;
const PROTECTED_PREFIX = "ftos-";
const EXCLUDED_KEYS = new Set([SNAPSHOT_KEY, LAST_BACKUP_KEY, THROTTLE_KEY]);

function safeParse(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

export function collectProtectedData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(PROTECTED_PREFIX) || EXCLUDED_KEYS.has(key) || key.startsWith("ftos-notified-")) continue;
    data[key] = localStorage.getItem(key);
  }
  return data;
}

export function validateProtectedData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  return Object.entries(data).every(([key, value]) => key.startsWith(PROTECTED_PREFIX) && typeof value === "string");
}

export function getSnapshots() {
  const snapshots = safeParse(localStorage.getItem(SNAPSHOT_KEY), []);
  return Array.isArray(snapshots) ? snapshots.filter(item => item?.id && validateProtectedData(item.data)) : [];
}

export function createSnapshot(reason = "Manual backup", { force = false } = {}) {
  const now = Date.now();
  const lastAuto = Number(localStorage.getItem(THROTTLE_KEY) || 0);
  if (!force && now - lastAuto < 60_000) return null;
  const data = collectProtectedData();
  if (!Object.keys(data).length) return null;
  const snapshot = {
    id: `backup-${now}`,
    createdAt: new Date(now).toISOString(),
    reason,
    version: "2.5.0-rc.2",
    data,
  };
  const next = [snapshot, ...getSnapshots()].slice(0, MAX_SNAPSHOTS);
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next));
  localStorage.setItem(LAST_BACKUP_KEY, snapshot.createdAt);
  localStorage.setItem(THROTTLE_KEY, String(now));
  window.dispatchEvent(new CustomEvent("ftos-backup-created", { detail: snapshot }));
  return snapshot;
}

export function restoreSnapshot(snapshot) {
  if (!snapshot || !validateProtectedData(snapshot.data)) throw new Error("Invalid backup");
  createSnapshot("Before restore", { force: true });
  Object.entries(snapshot.data).forEach(([key, value]) => localStorage.setItem(key, value));
  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
}

export function deleteSnapshot(id) {
  const next = getSnapshots().filter(item => item.id !== id);
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("ftos-backup-created"));
}

export function getLastBackupAt() {
  return localStorage.getItem(LAST_BACKUP_KEY) || getSnapshots()[0]?.createdAt || "";
}

export function makeExportPayload() {
  return {
    app: "Freedom Travel OS Personal",
    version: "2.5.0-rc.2",
    exportedAt: new Date().toISOString(),
    data: collectProtectedData(),
  };
}

export function importPayload(payload) {
  if (!payload || !validateProtectedData(payload.data)) throw new Error("Invalid backup file");
  createSnapshot("Before import", { force: true });
  Object.entries(payload.data).forEach(([key, value]) => localStorage.setItem(key, value));
  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
}

export function inspectDataHealth() {
  const data = collectProtectedData();
  const keys = Object.keys(data);
  const invalidKeys = keys.filter(key => {
    const value = data[key];
    if (value == null) return true;
    if (value === "undefined") return true;
    if (["ftos-theme-v2", LAST_BACKUP_KEY, THROTTLE_KEY].includes(key)) return false;
    try { JSON.parse(value); return false; } catch { return true; }
  });
  return { ok: invalidKeys.length === 0, keys: keys.length, invalidKeys };
}
