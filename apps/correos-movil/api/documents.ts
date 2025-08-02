
import { Platform } from 'react-native';

export const BACKEND_URL = 'http://192.168.1.72:3000' // cambie a tu ip


export async function fetchDocumentHtml(key: string): Promise<string> {
  const url = `${BACKEND_URL}/api/document-html?key=${encodeURIComponent(key)}`;
  console.log('⏳ Fetching HTML from:', url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.text();
}
