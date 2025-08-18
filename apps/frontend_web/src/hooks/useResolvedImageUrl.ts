// hooks/useResolvedImageUrl.ts
import { useEffect, useState } from 'react';
import { uploadApiService } from '@/services/uploadapi';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

export function useResolvedImageUrl(keyOrUrl: string | null | undefined): string {
  const [url, setUrl] = useState<string>(DEFAULT_IMAGE);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      if (!keyOrUrl) {
        setUrl(DEFAULT_IMAGE);
        return;
      }

      // Si ya es una URL completa, úsala tal cual
      const isFullUrl = /^https?:\/\//i.test(keyOrUrl);
      if (isFullUrl) {
        setUrl(keyOrUrl);
        return;
      }

      try {
        const signedUrl = await uploadApiService.getImageUrl(keyOrUrl);
        if (!cancelled) setUrl(signedUrl);
      } catch {
        if (!cancelled) setUrl(DEFAULT_IMAGE);
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, [keyOrUrl]);

  return url;
}
