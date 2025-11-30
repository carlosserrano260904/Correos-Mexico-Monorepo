'use client';
import React, { useState, useEffect } from 'react';
import { Plantilla } from '@/components/plantilla';
import { TabsSwitcher } from './componentes/tabs';
import { FavoritesList } from './componentes/lista';
import { CreateListButton } from './componentes/CreateListaButon';
import { ListaCard } from './componentes/Listacard';
import { useFavorites } from '@/hooks/useFavorites';
import { useLists } from '@/hooks/useLists';

export default function Page() {
  const [tab, setTab] = useState('Favoritos');
  const [isMounted, setIsMounted] = useState(false);

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) {
    return <Plantilla><div className="min-h-screen bg-white" /></Plantilla>;
  }

  return (
    <Plantilla>
      <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
        
        {/* TÍTULO PRINCIPAL GRANDE */}
        <h1 className="text-4xl font-bold text-black mb-8">
          Mis favoritos
        </h1>

        {/* CABECERA (Tabs a la izquierda, Botón a la derecha) */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="w-full sm:w-auto">
                <TabsSwitcher activeTab={tab} onTabChange={setTab} />
            </div>
            <div className="mt-4 sm:mt-0">
                <CreateListButton onClick={handleCreateList} />
            </div>
        </div>
        
        {/* PESTAÑA FAVORITOS */}
        {tab === 'Favoritos' && (
          <div className="mt-0">
            <FavoritesList />
          </div>
        )}
        
        {/* PESTAÑA LISTAS */}
        {tab === 'Listas' && (
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg mt-4">
                <p className="text-lg font-medium">No tienes listas creadas</p>
                <p className="text-sm mt-2">Crea una lista para organizar tus productos favoritos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Plantilla>
  );
}