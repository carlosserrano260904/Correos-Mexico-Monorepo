// stores/usePaymentsStore.ts - Store para gestión de pagos y tarjetas

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  FrontendCard, 
  FrontendTransaction, 
  BackendPaymentConfirmation,
  AddCardRequest,
  ConfirmPaymentRequest,
  DeleteCardRequest 
} from '@/schemas/payments'
import { paymentsApiService } from '@/services/paymentsApi'

interface PaymentsState {
  // === ESTADO DE TARJETAS ===
  cards: FrontendCard[];
  selectedCard: FrontendCard | null;
  defaultCardId: number | null;
  
  // === ESTADO DE TRANSACCIONES ===
  transactions: FrontendTransaction[];
  lastPayment: BackendPaymentConfirmation | null;
  
  // === ESTADO DE LA UI ===
  loading: boolean;
  error: string | null;
  currentUserId: number | null;
  
  // === OPERACIONES DE TARJETAS ===
  loadUserCards: (userId: number) => Promise<void>;
  addCard: (cardData: AddCardRequest) => Promise<FrontendCard>;
  deleteCard: (deleteData: DeleteCardRequest) => Promise<void>;
  
  // === OPERACIONES DE PAGOS ===
  confirmPayment: (paymentData: ConfirmPaymentRequest) => Promise<BackendPaymentConfirmation>;
  
  // === OPERACIONES DE TRANSACCIONES ===
  loadUserTransactions: (userId: number) => Promise<void>;
  
  // === OPERACIONES LOCALES ===
  selectCard: (cardId: number) => void;
  setDefaultCard: (cardId: number) => void;
  clearSelectedCard: () => void;
  
  // === GETTERS ===
  getSelectedCard: () => FrontendCard | null;
  getDefaultCard: () => FrontendCard | null;
  getCardsCount: () => number;
  hasCards: () => boolean;
  
  // === UTILIDADES ===
  clearError: () => void;
  refreshCards: () => Promise<void>;
  clearPaymentData: () => void;
}

export const usePaymentsStore = create<PaymentsState>()(
  devtools(
    persist(
      (set, get) => ({
        // === ESTADO INICIAL ===
        cards: [],
        selectedCard: null,
        defaultCardId: null,
        transactions: [],
        lastPayment: null,
        loading: false,
        error: null,
        currentUserId: null,

        // === CARGAR TARJETAS DEL USUARIO ===
        loadUserCards: async (userId: number) => {
          set({ loading: true, error: null, currentUserId: userId });
          
          try {
            console.log(`💳 Cargando tarjetas para usuario ${userId}`);
            const cards = await paymentsApiService.getUserCards(userId);
            
            console.log('✅ Tarjetas cargadas:', cards);
            
            // Marcar tarjeta por defecto si existe
            const { defaultCardId } = get();
            const updatedCards = cards.map(card => ({
              ...card,
              isDefault: card.CardId === defaultCardId,
            }));
            
            set({ 
              cards: updatedCards,
              loading: false,
              error: null,
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando tarjetas';
            set({ 
              error: errorMessage,
              loading: false,
              cards: [], // Limpiar tarjetas en caso de error
            });
            console.error('Error cargando tarjetas:', error);
          }
        },

        // === AGREGAR NUEVA TARJETA ===
        addCard: async (cardData: AddCardRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`💳 Agregando nueva tarjeta para usuario ${cardData.profileId}`);
            const newCard = await paymentsApiService.addCard(cardData);
            
            console.log('✅ Tarjeta agregada:', newCard);
            
            // Agregar a estado local
            set(state => ({ 
              cards: [...state.cards, newCard],
              loading: false,
              error: null,
            }));
            
            // Si es la primera tarjeta, marcarla como por defecto
            const { cards } = get();
            if (cards.length === 1) {
              get().setDefaultCard(newCard.CardId);
            }
            
            return newCard;
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error agregando tarjeta';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error agregando tarjeta:', error);
            throw error;
          }
        },

        // === ELIMINAR TARJETA ===
        deleteCard: async (deleteData: DeleteCardRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`💳 Eliminando tarjeta ${deleteData.paymentMethodId}`);
            await paymentsApiService.deleteCard(deleteData);
            
            console.log('✅ Tarjeta eliminada');
            
            // Eliminar del estado local
            set(state => {
              const cardToDelete = state.cards.find(card => 
                card.StripeCardId === deleteData.paymentMethodId
              );
              
              const newState = {
                cards: state.cards.filter(card => 
                  card.StripeCardId !== deleteData.paymentMethodId
                ),
                loading: false,
                error: null,
                // Limpiar selección si se eliminó la tarjeta seleccionada
                selectedCard: state.selectedCard?.StripeCardId === deleteData.paymentMethodId 
                  ? null 
                  : state.selectedCard,
                // Limpiar default si se eliminó la tarjeta por defecto
                defaultCardId: state.defaultCardId === cardToDelete?.CardId 
                  ? null 
                  : state.defaultCardId,
              };
              
              // Si se eliminó la tarjeta por defecto y hay otras, marcar la primera como default
              if (state.defaultCardId === cardToDelete?.CardId && newState.cards.length > 0) {
                newState.defaultCardId = newState.cards[0].CardId;
                newState.cards[0].isDefault = true;
              }
              
              return newState;
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error eliminando tarjeta';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error eliminando tarjeta:', error);
            throw error;
          }
        },

        // === CONFIRMAR PAGO ===
        confirmPayment: async (paymentData: ConfirmPaymentRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`💰 Confirmando pago para usuario ${paymentData.profileId}`);
            const paymentResult = await paymentsApiService.confirmPayment(paymentData);
            
            console.log('✅ Pago confirmado:', paymentResult);
            
            set({ 
              lastPayment: paymentResult,
              loading: false,
              error: null,
            });
            
            // Recargar transacciones después del pago exitoso
            const { currentUserId } = get();
            if (currentUserId) {
              get().loadUserTransactions(currentUserId);
            }
            
            return paymentResult;
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error procesando pago';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error confirmando pago:', error);
            throw error;
          }
        },

        // === CARGAR TRANSACCIONES ===
        loadUserTransactions: async (userId: number) => {
          // NOTA: No establecer loading aquí para no interferir con otras operaciones
          try {
            console.log(`📜 Cargando transacciones para usuario ${userId}`);
            const transactions = await paymentsApiService.getUserTransactions(userId);
            
            console.log('✅ Transacciones cargadas:', transactions);
            
            set({ 
              transactions,
              error: null, // Solo limpiar error si es exitoso
            });
            
          } catch (error) {
            console.error('Error cargando transacciones:', error);
            // No establecer error en el store para transacciones, solo loggear
            // set({ error: error instanceof Error ? error.message : 'Error cargando transacciones' });
          }
        },

        // === SELECCIONAR TARJETA ===
        selectCard: (cardId: number) => {
          set(state => {
            const card = state.cards.find(c => c.CardId === cardId);
            return {
              selectedCard: card || null,
              cards: state.cards.map(c => ({
                ...c,
                isSelected: c.CardId === cardId,
              })),
            };
          });
        },

        // === ESTABLECER TARJETA POR DEFECTO ===
        setDefaultCard: (cardId: number) => {
          set(state => ({
            defaultCardId: cardId,
            cards: state.cards.map(card => ({
              ...card,
              isDefault: card.CardId === cardId,
            })),
          }));
        },

        // === LIMPIAR SELECCIÓN ===
        clearSelectedCard: () => {
          set(state => ({
            selectedCard: null,
            cards: state.cards.map(card => ({
              ...card,
              isSelected: false,
            })),
          }));
        },

        // === GETTERS ===
        getSelectedCard: () => {
          return get().selectedCard;
        },

        getDefaultCard: () => {
          const { cards, defaultCardId } = get();
          return cards.find(card => card.CardId === defaultCardId) || null;
        },

        getCardsCount: () => {
          return get().cards.length;
        },

        hasCards: () => {
          return get().cards.length > 0;
        },

        // === UTILIDADES ===
        clearError: () => {
          set({ error: null });
        },

        refreshCards: async () => {
          const { currentUserId } = get();
          if (currentUserId) {
            await get().loadUserCards(currentUserId);
          }
        },

        clearPaymentData: () => {
          set({
            lastPayment: null,
            transactions: [],
            error: null,
          });
        },
      }),
      {
        name: 'payments-storage',
        partialize: (state) => ({
          defaultCardId: state.defaultCardId,
          selectedCard: state.selectedCard,
          // NOTA: No persistir datos sensibles como números de tarjeta completos
        }),
      }
    ),
    { name: 'PaymentsStore' }
  )
);

// === SELECTORES ESPECIALIZADOS ===
export const usePaymentsSelectors = () => {
  const store = usePaymentsStore();
  
  return {
    // Valores computados
    selectedCard: store.getSelectedCard(),
    defaultCard: store.getDefaultCard(),
    cardsCount: store.getCardsCount(),
    hasCards: store.hasCards(),
    
    // Listas filtradas
    getCardsByBrand: (brand: string) => 
      store.cards.filter(card => card.Brand.toLowerCase() === brand.toLowerCase()),
    
    getActiveCards: () =>
      store.cards.filter(card => card.CardId > 0), // Tarjetas válidas
    
    // Búsqueda de tarjetas
    searchCards: (query: string) => {
      const lowerQuery = query.toLowerCase();
      return store.cards.filter(card =>
        card.Brand.toLowerCase().includes(lowerQuery) ||
        card.Last4.includes(lowerQuery) ||
        (card.DisplayName && card.DisplayName.toLowerCase().includes(lowerQuery))
      );
    },

    // Estado del pago
    getLastPaymentStatus: () => store.lastPayment?.status || null,
    getLastPaymentAmount: () => store.lastPayment ? `$${Number(store.lastPayment.profile.id)}` : null,
    
    // Transacciones
    getRecentTransactions: (limit: number = 5) => 
      store.transactions.slice(0, limit),
    
    getTotalSpent: () =>
      store.transactions.reduce((total, transaction) => total + transaction.Total, 0),
  };
};