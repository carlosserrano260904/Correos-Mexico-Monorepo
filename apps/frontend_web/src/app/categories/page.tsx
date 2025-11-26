
'use client';

import { Suspense } from 'react';
import CategoriesPage from './CategoriesPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CategoriesPage />
    </Suspense>
  );
}
