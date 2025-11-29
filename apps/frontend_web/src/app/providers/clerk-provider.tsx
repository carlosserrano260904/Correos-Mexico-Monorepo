// app/providers/clerk-provider.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      localization={esES}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  );
}