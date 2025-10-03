import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Bot, User, Package, MapPin, Clock, Phone, Mail, ArrowLeft } from 'lucide-react-native'; // Añade ArrowLeft
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const { width } = Dimensions.get('window');

const ChatBot = () => {
  const navigation = useNavigation(); // Hook de navegación
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy el asistente virtual de Correos de México 📮. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const quickReplies = [
    { id: 1, text: 'Rastrear', icon: '📦' },
    { id: 2, text: 'Horarios', icon: '🕐' },
    { id: 3, text: 'Tarifas', icon: '💰' },
    { id: 4, text: 'Oficinas', icon: '📍' },
    { id: 5, text: 'Servicios', icon: '📋' },
    { id: 6, text: 'Contacto', icon: '📞' }
  ];

  // Base de datos estática expandida
  const staticResponses = {
    rastrear: {
      primary: 'Para rastrear tu paquete, necesito el número de guía. Puedes encontrarlo en tu recibo de envío.',
      details: '📋 Formato del número de guía: ME123456789MX\n\n🔍 Pasos para rastrear:\n1. Ingresa a correosdemexico.gob.mx\n2. Selecciona "Rastreo de envíos"\n3. Ingresa tu número de guía\n4. Consulta el estatus actual\n\n📱 También puedes rastrear por SMS enviando tu número de guía al 33123'
    },
    horarios: {
      primary: 'Nuestros horarios de atención general son:',
      details: '🕐 HORARIOS DE ATENCIÓN:\n\n📍 Oficinas principales:\n• Lunes a Viernes: 8:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM\n• Domingos: Cerrado\n\n📮 Buzones de recolección:\n• Lunes a Viernes: 2 recolecciones diarias\n• Sábados: 1 recolección\n\n⚠️ Los horarios pueden variar según la sucursal'
    },
    tarifas: {
      primary: 'Las tarifas varían según el destino, peso y tipo de servicio:',
      details: '💰 TARIFAS DE ENVÍO:\n\n📦 NACIONAL:\n• Carta simple: $12 MXN\n• Carta certificada: $35 MXN\n• Paquete hasta 1kg: $45 MXN\n• Paquete hasta 5kg: $85 MXN\n\n🌍 INTERNACIONAL:\n• Carta simple: $28 MXN\n• Carta certificada: $150 MXN\n• Paquete hasta 1kg: $280 MXN\n• Paquete hasta 5kg: $650 MXN\n\n📋 Servicios adicionales disponibles con costo extra'
    },
    oficinas: {
      primary: 'Contamos con más de 2,500 oficinas en todo México.',
      details: '📍 OFICINAS CORREOS DE MÉXICO:\n\n🏢 Oficinas principales en:\n• Ciudad de México\n• Guadalajara\n• Monterrey\n• Puebla\n• Tijuana\n• Mérida\n\n🔍 Para encontrar la oficina más cercana:\n• Visita correosdemexico.gob.mx\n• Usa el localizador de oficinas\n• Llama al 01 800 CORREOS\n\n📱 También disponible en la app móvil'
    },
    servicios: {
      primary: 'Ofrecemos una amplia gama de servicios postales:',
      details: '📋 SERVICIOS DISPONIBLES:\n\n📮 Servicios básicos:\n• Envío de cartas y paquetes\n• Apartado postal\n• Lista de correos\n• Telegrama\n\n📦 Servicios especiales:\n• Entrega inmediata\n• Acuse de recibo\n• Valor declarado\n• Multipack\n\n💳 Servicios adicionales:\n• Giros nacionales\n• Filatelia\n• Mensajería especializada'
    },
    contacto: {
      primary: 'Puedes contactarnos por múltiples medios:',
      details: '📞 INFORMACIÓN DE CONTACTO:\n\n☎️ Centro de atención:\n• 01 800 CORREOS (2677367)\n• Lunes a Viernes 8:00-18:00\n• Sábados 9:00-14:00\n\n📧 Correo electrónico:\n• atencion.cliente@correosdemexico.gob.mx\n• Respuesta en 24-48 horas\n\n🌐 Sitio web:\n• www.correosdemexico.gob.mx\n• Chat en línea disponible\n\n📱 Redes sociales:\n• Facebook: @CorreosdeMexico\n• Twitter: @CorreosMx'
    },
    quejas: {
      primary: 'Para presentar una queja o sugerencia:',
      details: '📝 QUEJAS Y SUGERENCIAS:\n\n📞 Línea directa:\n• 01 800 QUEJAS (783527)\n• Atención 24/7\n\n🌐 En línea:\n• Portal de quejas CONDUSEF\n• Sitio web oficial\n\n📧 Por correo:\n• quejas@correosdemexico.gob.mx\n\n🏢 Presencial:\n• En cualquier oficina\n• Formato disponible en ventanilla\n\n📋 Información requerida:\n• Número de guía o referencia\n• Fecha del servicio\n• Descripción detallada'
    }
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Respuestas más específicas y detalladas
    if (message.includes('rastrear') || message.includes('paquete') || message.includes('seguimiento') || message.includes('guía')) {
      return staticResponses.rastrear.details;
    } 
    else if (message.includes('horario') || message.includes('hora') || message.includes('abierto') || message.includes('cerrado')) {
      return staticResponses.horarios.details;
    } 
    else if (message.includes('tarifa') || message.includes('precio') || message.includes('costo') || message.includes('cuánto')) {
      return staticResponses.tarifas.details;
    } 
    else if (message.includes('oficina') || message.includes('sucursal') || message.includes('ubicación') || message.includes('dirección')) {
      return staticResponses.oficinas.details;
    } 
    else if (message.includes('servicio') || message.includes('qué hacen') || message.includes('qué ofrecen')) {
      return staticResponses.servicios.details;
    }
    else if (message.includes('contacto') || message.includes('teléfono') || message.includes('llamar') || message.includes('email')) {
      return staticResponses.contacto.details;
    }
    else if (message.includes('queja') || message.includes('reclamo') || message.includes('problema') || message.includes('sugerencia')) {
      return staticResponses.quejas.details;
    }
    // Respuestas para saludos
    else if (message.includes('hola') || message.includes('buenos') || message.includes('buenas') || message.includes('saludos')) {
      return '¡Hola! Es un gusto atenderte. Soy tu asistente virtual de Correos de México 📮. Puedo ayudarte con:\n\n• Información de rastreo\n• Horarios de servicio\n• Tarifas de envío\n• Ubicación de oficinas\n• Servicios disponibles\n• Datos de contacto\n\n¿En qué puedo asistirte?';
    }
    // Respuestas para agradecimientos
    else if (message.includes('gracias') || message.includes('thank')) {
      return '¡De nada! Es un placer ayudarte. 😊\n\nSi necesitas más información sobre nuestros servicios, no dudes en preguntarme. Estoy aquí para asistirte con todo lo relacionado a Correos de México.';
    }
    // Respuestas para despedidas
    else if (message.includes('adiós') || message.includes('bye') || message.includes('hasta luego') || message.includes('nos vemos')) {
      return '¡Hasta pronto! 👋\n\nGracias por usar nuestros servicios. Recuerda que estoy disponible 24/7 para ayudarte con cualquier consulta sobre Correos de México.\n\n¡Que tengas un excelente día!';
    }
    // Respuestas para ayuda general
    else if (message.includes('ayuda') || message.includes('help') || message.includes('qué puedes hacer')) {
      return '🤖 ¿EN QUÉ PUEDO AYUDARTE?\n\nPuedo brindarte información sobre:\n\n📦 Rastreo de paquetes\n🕐 Horarios de atención\n💰 Tarifas de envío\n📍 Ubicación de oficinas\n📋 Servicios disponibles\n📞 Información de contacto\n📝 Quejas y sugerencias\n\nSolo escribe tu consulta o usa los botones de respuesta rápida.';
    }
    // Respuesta por defecto más informativa
    else {
      return 'Entiendo tu consulta, pero necesito más información específica para ayudarte mejor. 🤔\n\nPuedes preguntarme sobre:\n• Rastreo de envíos\n• Horarios y ubicaciones\n• Tarifas y servicios\n• Contacto y quejas\n\nO llama a nuestro centro de atención: 01 800 CORREOS (2677367)';
    }
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular tiempo de respuesta del bot (más realista)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 800); // Entre 800ms y 1800ms
  };

  const handleQuickReply = (reply) => {
    const userMessage = {
      id: messages.length + 1,
      text: reply.text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(reply.text),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 800);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Botón de regreso */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={26} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.botAvatar}>
            <Bot size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Asistente Correos de México</Text>
            <Text style={styles.headerSubtitle}>En línea • Respuesta inmediata</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageWrapper,
            message.isBot ? styles.botMessageWrapper : styles.userMessageWrapper
          ]}>
            {message.isBot && (
              <View style={styles.botAvatarSmall}>
                <Bot size={16} color="#FFFFFF" />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              message.isBot ? styles.botMessage : styles.userMessage
            ]}>
              <Text style={[
                styles.messageText,
                message.isBot ? styles.botMessageText : styles.userMessageText
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.isBot ? styles.botMessageTime : styles.userMessageTime
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
            {!message.isBot && (
              <View style={styles.userAvatarSmall}>
                <User size={16} color="#DE1484" />
              </View>
            )}
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
            <View style={styles.botAvatarSmall}>
              <Bot size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.messageBubble, styles.botMessage, styles.typingBubble]}>
              <Text style={styles.typingText}>Escribiendo...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      <ScrollView 
        horizontal 
        style={styles.quickRepliesContainer}
        showsHorizontalScrollIndicator={false}
      >
        {quickReplies.map((reply) => (
          <TouchableOpacity
            key={reply.id}
            style={styles.quickReplyButton}
            onPress={() => handleQuickReply(reply)}
          >
            <Text style={styles.quickReplyIcon}>{reply.icon}</Text>
            <Text style={styles.quickReplyText}>{reply.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={inputText.trim() === ''}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#DE1484',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DE1484',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(222,20,132,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  botMessage: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#DE1484',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: '#333333',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 15,
    marginTop: 4,
  },
  botMessageTime: {
    color: '#666666',
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  typingBubble: {
    backgroundColor: '#E8E8E8',
  },
  typingText: {
    color: '#666666',
    fontStyle: 'italic',
  },
  quickRepliesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    maxHeight: 70,
  },
  quickReplyButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 45,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickReplyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  quickReplyText: {
    fontSize: 14,
    color: '#DE1484',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#FAFAFA',
  },
  sendButton: {
    backgroundColor: '#DE1484',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#DE1484',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0.1,
  },
});

export default ChatBot;