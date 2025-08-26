// hooks/usePayments.ts - Hook personalizado para manejo completo de pagos y tarjetas

'use client';

import React, { useEffect } from 'react';
import { usePaymentsStore, usePaymentsSelectors } from '@/stores/usePaymentsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import type { 
  FrontendCard, 
  FrontendTransaction,
  BackendPaymentConfirmation,
  AddCardRequest, 
  ConfirmPaymentRequest,
  DeleteCardRequest,
  CardFormData
} from '@/schemas/payments';

/**
 * Hook principal para manejo de pagos y tarjetas
 * 
 * @example
 * ```typescript
 * const payments = usePayments();
 * 
 * // Cargar tarjetas del usuario
 * useEffect(() => {
 *   payments.loadCards(userId);
 * }, [userId]);
 * 
 * // Agregar nueva tarjeta
 * await payments.addCard(cardData);
 * 
 * // Confirmar pago
 * await payments.confirmPayment({ profileId: '1', total: 100.50 });
 * ```
 */
export const usePayments = () => {
  const {
    // State
    cards,
    selectedCard,
    defaultCardId,
    transactions,
    lastPayment,
    loading,
    error,
    currentUserId,
    
    // Actions
    loadUserCards,
    addCard,
    deleteCard,
    confirmPayment,
    loadUserTransactions,
    selectCard,
    setDefaultCard,
    clearSelectedCard,
    
    // Getters
    getSelectedCard,
    getDefaultCard,
    getCardsCount,
    hasCards,
    
    // Utils
    clearError,
    refreshCards,
    clearPaymentData,
  } = usePaymentsStore();

  // Obtener selectores especializados
  const selectors = usePaymentsSelectors();

  // Wrapper functions con manejo de errores mejorado
  const handleLoadCards = async (userId: number) => {
    try {
      await loadUserCards(userId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error en handleLoadCards:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al cargar tarjetas' 
      };
    }
  };

  const handleAddCard = async (cardData: AddCardRequest) => {
    try {
      const newCard = await addCard(cardData);
      return { success: true, card: newCard };
    } catch (error) {
      console.error('❌ Error en handleAddCard:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al agregar tarjeta' 
      };
    }
  };

  const handleDeleteCard = async (deleteData: DeleteCardRequest) => {
    try {
      await deleteCard(deleteData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar tarjeta' 
      };
    }
  };

  const handleConfirmPayment = async (paymentData: ConfirmPaymentRequest) => {
    try {
      const result = await confirmPayment(paymentData);
      return { success: true, payment: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al procesar pago' 
      };
    }
  };

  const handleLoadTransactions = async (userId: number) => {
    try {
      await loadUserTransactions(userId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al cargar transacciones' 
      };
    }
  };

  return {
    // === STATE ===
    cards,
    selectedCard,
    defaultCardId,
    transactions,
    lastPayment,
    loading,
    error,
    currentUserId,
    
    // === API ACTIONS CON ERROR HANDLING ===
    loadCards: handleLoadCards,
    addCard: handleAddCard,
    deleteCard: handleDeleteCard,
    confirmPayment: handleConfirmPayment,
    loadTransactions: handleLoadTransactions,
    
    // === LOCAL ACTIONS ===
    selectCard,
    setDefaultCard,
    clearSelectedCard,
    
    // === GETTERS ===
    getSelectedCard,
    getDefaultCard,
    getCardsCount,
    hasCards,
    
    // === SELECTORES ESPECIALIZADOS ===
    ...selectors,
    
    // === UTILS ===
    clearError,
    refreshCards,
    clearPaymentData,
    
    // === HELPER FUNCTIONS ===
    isCardSelected: (cardId: number) => selectedCard?.CardId === cardId,
    isDefaultCard: (cardId: number) => defaultCardId === cardId,
    canDeleteCard: (cardId: number) => {
      // No se puede eliminar si es la única tarjeta o si está siendo usada en un pago
      return cards.length > 1 && defaultCardId !== cardId;
    },
    
    // === VALIDATION HELPERS ===
    validateCardForm: (data: Partial<CardFormData>) => {
      const errors: string[] = [];
      
      if (!data.NombreTarjeta?.trim()) errors.push('El nombre es obligatorio');
      if (!data.NumeroTarjeta?.trim()) errors.push('El número de tarjeta es obligatorio');
      if (!data.FechaExpiracion?.trim()) errors.push('La fecha de expiración es obligatoria');
      if (!data.CodigoSeguridad?.trim()) errors.push('El código de seguridad es obligatorio');
      
      // Validar formato de número de tarjeta
      if (data.NumeroTarjeta) {
        const cleaned = data.NumeroTarjeta.replace(/\s+/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) {
          errors.push('Número de tarjeta inválido');
        }
      }
      
      // Validar formato de fecha MM/AA
      if (data.FechaExpiracion && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.FechaExpiracion)) {
        errors.push('Formato de fecha debe ser MM/AA');
      }
      
      // Validar CVV
      if (data.CodigoSeguridad && !/^\d{3,4}$/.test(data.CodigoSeguridad)) {
        errors.push('El CVV debe tener 3 o 4 dígitos');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    
    // === STATUS CHECKS ===
    isLoading: () => loading,
    hasError: () => !!error,
    isEmpty: () => cards.length === 0,
    isReady: () => !loading && currentUserId !== null,
    hasSelectedCard: () => !!selectedCard,
    hasDefaultCard: () => !!getDefaultCard(),
    
    // === PAYMENT HELPERS ===
    canMakePayment: () => {
      return hasCards() && !loading && !error;
    },
    
    getPaymentSummary: (amount: number) => {
      const defaultCard = getDefaultCard();
      return {
        amount: amount,
        formattedAmount: `$${amount.toFixed(2)} MXN`,
        card: defaultCard,
        cardDisplay: defaultCard?.DisplayName || 'No hay tarjeta seleccionada',
        canPay: !!defaultCard && amount > 0,
      };
    },
  };
};

/**
 * Hook para componentes que requieren carga automática de tarjetas
 * Carga automáticamente las tarjetas del usuario autenticado
 */
export const useUserCards = (userId?: number) => {
  const payments = usePayments();
  const { user } = useAuthStore();
  
  // Determinar el userId a usar
  const effectiveUserId = userId || user?.id;
  
  useEffect(() => {
    if (effectiveUserId && (!payments.currentUserId || payments.currentUserId !== effectiveUserId)) {
      payments.loadCards(effectiveUserId);
    }
  }, [effectiveUserId, payments.currentUserId]);

  return payments;
};

/**
 * Hook para seleccionar una tarjeta específica
 * Útil para formularios de checkout o selección de método de pago
 */
export const useCardSelection = (cardId?: number) => {
  const payments = usePayments();
  
  useEffect(() => {
    if (cardId) {
      payments.selectCard(cardId);
    } else {
      payments.clearSelectedCard();
    }
    
    return () => {
      payments.clearSelectedCard();
    };
  }, [cardId]);

  return {
    ...payments,
    isSelected: cardId ? payments.isCardSelected(cardId) : false,
  };
};

/**
 * Hook para manejo de tarjeta por defecto
 * Útil para checkout y procesamiento de pagos
 */
export const useDefaultCard = () => {
  const payments = usePayments();
  
  const setAsDefault = (cardId: number) => {
    payments.setDefaultCard(cardId);
    // También seleccionar como tarjeta activa
    payments.selectCard(cardId);
  };
  
  return {
    ...payments,
    defaultCard: payments.getDefaultCard(),
    setAsDefault,
    hasDefaultCard: () => !!payments.getDefaultCard(),
  };
};

/**
 * Hook para procesamiento de pagos
 * Incluye validaciones y manejo del flujo completo de pago
 */
export const usePaymentProcessor = () => {
  const payments = usePayments();
  const { user } = useAuthStore();
  
  const processPayment = async (amount: number, cardId?: number) => {
    try {
      // Validaciones previas
      if (!user?.id) {
        return { success: false, error: 'Usuario no autenticado' };
      }
      
      if (amount <= 0) {
        return { success: false, error: 'Monto inválido' };
      }
      
      if (!payments.hasCards()) {
        return { success: false, error: 'No hay tarjetas disponibles' };
      }
      
      // Usar tarjeta específica o la por defecto
      if (cardId) {
        payments.selectCard(cardId);
      }
      
      const cardToUse = cardId ? 
        payments.cards.find(c => c.CardId === cardId) : 
        payments.getDefaultCard();
      
      if (!cardToUse) {
        return { success: false, error: 'No hay tarjeta seleccionada para el pago' };
      }
      
      console.log('🔄 Procesando pago:', {
        amount,
        cardId: cardToUse.CardId,
        userId: user.id
      });
      
      // Procesar el pago
      const paymentData: ConfirmPaymentRequest = {
        profileId: String(user.id),
        total: amount,
      };
      
      return await payments.confirmPayment(paymentData);
      
    } catch (error) {
      console.error('❌ Error en processPayment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error procesando el pago' 
      };
    }
  };
  
  return {
    ...payments,
    processPayment,
    canProcess: (amount: number) => {
      return payments.canMakePayment() && amount > 0 && !!user?.id;
    },
  };
};

/**
 * Hook para manejo de transacciones e historial
 * Carga automáticamente el historial de transacciones
 */
export const useTransactionHistory = (userId?: number) => {
  const payments = usePayments();
  const { user } = useAuthStore();
  
  const effectiveUserId = userId || user?.id;
  
  useEffect(() => {
    if (effectiveUserId) {
      payments.loadTransactions(effectiveUserId);
    }
  }, [effectiveUserId]);
  
  return {
    transactions: payments.transactions,
    recentTransactions: payments.getRecentTransactions(),
    totalSpent: payments.getTotalSpent(),
    loading: payments.loading,
    error: payments.error,
    refreshTransactions: () => effectiveUserId ? payments.loadTransactions(effectiveUserId) : Promise.resolve(),
  };
};