// services/paymentsApi.ts - API service para pagos, tarjetas y transacciones

import api from '../lib/api';
import { 
  BackendCard,
  BackendCardSchema,
  BackendCreateCardDto,
  BackendPaymentConfirmation, 
  BackendPaymentConfirmationSchema,
  BackendTransaction,
  BackendTransactionSchema,
  FrontendCard,
  FrontendTransaction,
  AddCardRequest,
  ConfirmPaymentRequest,
  DeleteCardRequest,
  CardTransformSchema,
  TransactionTransformSchema
} from '@/schemas/payments';

class PaymentsApiService {
  private readonly baseUrl = '/cards'; // Base URL para tarjetas
  private readonly paymentsUrl = '/pagos'; // Base URL para pagos
  private readonly transactionsUrl = '/transactions'; // Base URL para transacciones

  // ============================================================
  // 💳 GESTIÓN DE TARJETAS
  // ============================================================

  /**
   * GET /cards/user/:userId - Obtener tarjetas del usuario
   */
  async getUserCards(userId: number): Promise<FrontendCard[]> {
    try {
      console.log(`💳 === OBTENIENDO TARJETAS DEL USUARIO ${userId} ===`);
      
      const response = await api.get<BackendCard[]>(`${this.baseUrl}/user/${userId}`);
      
      console.log('📡 Respuesta de tarjetas (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Tarjetas encontradas: ${response.data.length}`);
      console.log('   Raw data:', response.data);
      
      // Validar y transformar cada tarjeta
      const validatedCards = response.data.map(card => BackendCardSchema.parse(card));
      const frontendCards: FrontendCard[] = validatedCards.map(card => 
        CardTransformSchema.parse(card)
      );
      
      console.log('✅ Tarjetas mapeadas para frontend:', frontendCards);
      
      return frontendCards;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO TARJETAS ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
          // Usuario no tiene tarjetas - devolver array vacío
          console.log('📝 Usuario no tiene tarjetas guardadas');
          return [];
        }
        
        const backendMessage = axiosError.response?.data?.message;
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al obtener las tarjetas');
    }
  }

  /**
   * GET /cards/:profileId - Obtener tarjetas por profileId
   */
  async getCardsByProfile(profileId: number): Promise<FrontendCard[]> {
    try {
      console.log(`💳 === OBTENIENDO TARJETAS POR PROFILE ${profileId} ===`);
      
      const response = await api.get<BackendCard[]>(`${this.baseUrl}/${profileId}`);
      
      console.log('📡 Respuesta de tarjetas por profile:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Tarjetas encontradas: ${response.data.length}`);
      
      // Validar y transformar
      const validatedCards = response.data.map(card => BackendCardSchema.parse(card));
      const frontendCards: FrontendCard[] = validatedCards.map(card => 
        CardTransformSchema.parse(card)
      );
      
      console.log('✅ Tarjetas mapeadas para frontend:', frontendCards);
      return frontendCards;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO TARJETAS POR PROFILE ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
          return [];
        }
        
        const backendMessage = axiosError.response?.data?.message;
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al obtener las tarjetas');
    }
  }

  /**
   * POST /cards - Agregar nueva tarjeta
   */
  async addCard(cardData: AddCardRequest): Promise<FrontendCard> {
    try {
      console.log(`💳 === AGREGANDO NUEVA TARJETA ===`);
      console.log(`   Usuario: ${cardData.profileId}`);
      console.log('   Datos (token oculto):', { 
        ...cardData, 
        token: '[HIDDEN]',
        stripeCustomerId: cardData.stripeCustomerId.substring(0, 10) + '...'
      });
      
      // Preparar datos para el backend - solo las propiedades que el backend espera
      const backendData = {
        stripeCustomerId: cardData.stripeCustomerId,
        token: cardData.token,
        profileId: cardData.profileId,
      };
      
      const response = await api.post<BackendCard>(`${this.baseUrl}`, backendData);
      
      console.log('📡 Tarjeta creada (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Created card:', response.data);
      
      // Validar y transformar respuesta
      const validatedCard = BackendCardSchema.parse(response.data);
      const frontendCard = CardTransformSchema.parse(validatedCard);
      
      console.log('✅ Tarjeta creada y mapeada:', frontendCard);
      
      return frontendCard;
      
    } catch (error) {
      console.error('❌ === ERROR AGREGANDO TARJETA ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 400) {
          throw new Error(backendMessage || 'Datos inválidos para agregar tarjeta');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al agregar la tarjeta');
    }
  }

  /**
   * DELETE /cards - Eliminar tarjeta
   */
  async deleteCard(deleteData: DeleteCardRequest): Promise<void> {
    try {
      console.log(`💳 === ELIMINANDO TARJETA ===`);
      console.log(`   PaymentMethodId: ${deleteData.paymentMethodId}`);
      console.log(`   ProfileId: ${deleteData.profileId}`);
      
      const response = await api.delete(`${this.baseUrl}`, { data: deleteData });
      
      console.log('📡 Tarjeta eliminada:');
      console.log(`   Status: ${response.status}`);
      
      console.log('✅ Tarjeta eliminada exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR ELIMINANDO TARJETA ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Tarjeta no encontrada');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al eliminar la tarjeta');
    }
  }

  // ============================================================
  // 💰 GESTIÓN DE PAGOS
  // ============================================================

  /**
   * POST /pagos/confirmar - Confirmar pago
   */
  async confirmPayment(paymentData: ConfirmPaymentRequest): Promise<BackendPaymentConfirmation> {
    try {
      console.log(`💰 === CONFIRMANDO PAGO ===`);
      console.log(`   Profile: ${paymentData.profileId}`);
      console.log(`   Total: $${paymentData.total}`);
      
      const response = await api.post<BackendPaymentConfirmation>(
        `${this.paymentsUrl}/confirmar`, 
        paymentData
      );
      
      console.log('📡 Pago confirmado (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Payment result:', response.data);
      
      // Validar respuesta
      const validatedPayment = BackendPaymentConfirmationSchema.parse(response.data);
      
      console.log('✅ Pago confirmado exitosamente:', validatedPayment);
      
      return validatedPayment;
      
    } catch (error) {
      console.error('❌ === ERROR CONFIRMANDO PAGO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 400) {
          throw new Error(backendMessage || 'Error en los datos del pago');
        } else if (axiosError.response?.status === 404) {
          throw new Error('Perfil o tarjeta no encontrados');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al procesar el pago');
    }
  }

  // ============================================================
  // 📜 GESTIÓN DE TRANSACCIONES
  // ============================================================

  /**
   * GET /transactions - Obtener transacciones del usuario (implementar cuando el backend esté listo)
   */
  async getUserTransactions(userId: number): Promise<FrontendTransaction[]> {
    try {
      console.log(`📜 === OBTENIENDO TRANSACCIONES DEL USUARIO ${userId} ===`);
      
      // NOTA: Este endpoint puede no estar implementado aún en el backend
      const response = await api.get<BackendTransaction[]>(`${this.transactionsUrl}/user/${userId}`);
      
      console.log('📡 Respuesta de transacciones (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Transacciones encontradas: ${response.data.length}`);
      
      // Validar y transformar
      const validatedTransactions = response.data.map(transaction => 
        BackendTransactionSchema.parse(transaction)
      );
      const frontendTransactions: FrontendTransaction[] = validatedTransactions.map(transaction => 
        TransactionTransformSchema.parse(transaction)
      );
      
      console.log('✅ Transacciones mapeadas para frontend:', frontendTransactions);
      return frontendTransactions;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO TRANSACCIONES ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
          return []; // Usuario no tiene transacciones
        }
        
        const backendMessage = axiosError.response?.data?.message;
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al obtener las transacciones');
    }
  }

  // ============================================================
  // 🔧 UTILIDADES
  // ============================================================

  /**
   * Health check para el servicio de pagos
   */
  async healthCheck(): Promise<{ isHealthy: boolean; error?: string }> {
    try {
      console.log('🏥 === VERIFICANDO ESTADO DEL API DE PAGOS ===');
      
      // Probar endpoint básico de tarjetas
      await api.get(`${this.baseUrl}`, { timeout: 5000 });
      
      return { isHealthy: true };
    } catch (error) {
      console.log('🔍 Respuesta del payments health check:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        return { 
          isHealthy: false, 
          error: `Payments API responded with ${axiosError.response?.status}` 
        };
      }
      
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any;
        if (axiosError.code === 'ECONNABORTED') {
          return { isHealthy: false, error: 'Payments API timeout' };
        }
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          return { isHealthy: false, error: 'Cannot connect to payments API' };
        }
      }
      
      return { isHealthy: false, error: 'Unknown payments API error' };
    }
  }

  /**
   * Utilidad: Formatear número de tarjeta para mostrar
   */
  static formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  }

  /**
   * Utilidad: Validar número de tarjeta con algoritmo de Luhn
   */
  static validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    let sum = 0;
    let shouldDouble = false;
    
    // Iterate from right to left
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }

  /**
   * Utilidad: Detectar tipo de tarjeta
   */
  static detectCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (cleaned.match(/^4/)) return 'visa';
    if (cleaned.match(/^5[1-5]/)) return 'mastercard';
    if (cleaned.match(/^3[47]/)) return 'amex';
    if (cleaned.match(/^6/)) return 'discover';
    
    return 'unknown';
  }
}

export const paymentsApiService = new PaymentsApiService();