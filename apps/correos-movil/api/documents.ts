
import { Platform } from 'react-native';


const LA_ip: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';



export async function fetchDocumentHtml(key: string): Promise<string> {
  const url = `${LA_ip}/api/document-html?key=${encodeURIComponent(key)}`;
  console.log('⏳ Fetching HTML from:', url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.text();
}
