'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plantilla } from '@/components/plantilla';
import { TabsSwitcher } from './componentes/tabs';
import { FavoritesList } from './componentes/lista';
import { CreateListButton } from './componentes/CreateListaButon';
import { ListaCard } from './componentes/Listacard';
import { useFavorites } from '@/hooks/useFavorites';
import { useLists } from '@/hooks/useLists';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const router = useRouter();
  const auth = useAuth();
  const [tab, setTab] = useState('Favoritos');
  const { getTotalFavorites } = useFavorites();
  const { 
    Lists, 
    createList, 
    deleteList, 
    updateListName, 
    getTotalLists, 
    getListProductCount, 
    getListCoverImage 
  } = useLists();

  // Protección de autenticación
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.push('/login?redirect=/favoritos');
    }
  }, [auth.loading, auth.isAuthenticated, router]);

  // Mostrar loading mientras se verifica autenticación
  if (auth.loading) {
    return (
      <Plantilla>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </Plantilla>
    );
  }

  // Si no está autenticado, no mostrar el contenido
  if (!auth.isAuthenticated) {
    return null; // El useEffect se encargará de la redirección
  }

  const handleCreateList = (name: string) => {
    createList(name);
  };

  const handleEditList = (listId: number, currentName: string) => {
    const newName = prompt('Nuevo nombre de la lista:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateListName(listId, newName.trim());
    }
  };

  const handleDeleteList = (listId: number, listName: string) => {
    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar la lista "${listName}"?`);
    if (confirm) {
      deleteList(listId);
    }
  };

  return (
    <Plantilla>
      <div className="px-8 py-6 max-w-6xl mx-auto">
        <TabsSwitcher activeTab={tab} onTabChange={setTab} />
        
        {tab === 'Favoritos' && (
          <>
            <CreateListButton onClick={handleCreateList} />
            <FavoritesList />
            {getTotalFavorites() === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tienes productos en favoritos</p>
                <p className="text-sm mt-2">Agrega productos a tus favoritos para verlos aquí</p>
              </div>
            )}
          </>
        )}
        
        {tab === 'Listas' && (
          <>
            <CreateListButton onClick={handleCreateList} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
              {Lists.map((lista) => (
                <ListaCard
                  key={lista.ListaID}
                  id={lista.ListaID.toString()}
                  nombre={lista.ListaName}
                  cantidad={getListProductCount(lista.ListaID)}
                  image={getListCoverImage(lista.ListaID)}
                  onEdit={() => handleEditList(lista.ListaID, lista.ListaName)}
                  onDelete={() => handleDeleteList(lista.ListaID, lista.ListaName)}
                />
              ))}
            </div>
            {getTotalLists() === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tienes listas creadas</p>
                <p className="text-sm mt-2">Crea una lista para organizar tus productos favoritos</p>
              </div>
            )}
          </>
        )}
      </div>
    </Plantilla>
  );
}