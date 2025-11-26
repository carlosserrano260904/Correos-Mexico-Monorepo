'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Plantilla } from '@/components/plantilla';
import { ListDetailView } from './Components/listDetailView';

export default function ListPage() {
  const params = useParams();
  const listId = parseInt(params.id as string);

  if (isNaN(listId)) {
    return (
      <Plantilla>
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">ID de lista inválido</p>
        </div>
      </Plantilla>
    );
  }

  return (
    <Plantilla>
      <ListDetailView listId={listId} />
    </Plantilla>
  );
}