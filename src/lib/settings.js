import fs from 'fs/promises';
import path from 'path';
import { getSiteUrl } from './siteUrl';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src/data/settings.json');

export function getDefaultAdminLoginUrl() {
  return `${getSiteUrl()}/admin`;
}

export async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      authorName: parsed.authorName || 'Zeon Academy',
      authorImage: parsed.authorImage || '',
      universalNoIndex: Boolean(parsed.universalNoIndex),
      adminLoginUrl: parsed.adminLoginUrl || getDefaultAdminLoginUrl(),
    };
  } catch {
    return {
      authorName: 'Zeon Academy',
      authorImage: '',
      universalNoIndex: false,
      adminLoginUrl: getDefaultAdminLoginUrl(),
    };
  }
}

export async function writeSettings(settings) {
  const dir = path.dirname(SETTINGS_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}
