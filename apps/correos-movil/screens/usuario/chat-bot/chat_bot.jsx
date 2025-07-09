import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Bot, User, Package, MapPin, Clock, Phone, Mail } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ChatBot = () => {
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
    { id: 1, text: 'Rastrear paquete', icon: '📦' },
    { id: 2, text: 'Horarios de servicio', icon: '🕐' },
    { id: 3, text: 'Tarifas de envío', icon: '💰' },
    { id: 4, text: 'Oficinas cercanas', icon: '📍' }
  ];

  const botResponses = {
    'rastrear': 'Para rastrear tu paquete, necesito el número de guía. Puedes encontrarlo en tu recibo de envío. El formato es: ME123456789MX',
    'horarios': 'Nuestros horarios de atención son:\n• Lunes a Viernes: 8:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM\n• Domingos: Cerrado',
    'tarifas': 'Las tarifas varían según el destino y peso:\n• Nacional: Desde $25 MXN\n• Internacional: Desde $150 MXN\n¿Necesitas una cotización específica?',
    'oficinas': 'Para encontrar la oficina más cercana, compárteme tu código postal o ciudad, y te ayudo a localizar nuestras sucursales.',
    'contacto': 'Puedes contactarnos:\n📞 01 800 CORREOS (2677367)\n📧 atencion.cliente@correosdemexico.gob.mx\n🌐 www.correosdemexico.gob.mx'
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('rastrear') || message.includes('paquete') || message.includes('seguimiento')) {
      return botResponses.rastrear;
    } else if (message.includes('horario') || message.includes('hora')) {
      return botResponses.horarios;
    } else if (message.includes('tarifa') || message.includes('precio') || message.includes('costo')) {
      return botResponses.tarifas;
    } else if (message.includes('oficina') || message.includes('sucursal') || message.includes('ubicación')) {
      return botResponses.oficinas;
    } else if (message.includes('contacto') || message.includes('teléfono') || message.includes('llamar')) {
      return botResponses.contacto;
    } else if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
      return '¡Hola! Es un gusto atenderte. ¿En qué servicio de Correos de México puedo asistirte?';
    } else if (message.includes('gracias')) {
      return '¡De nada! Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?';
    } else {
      return 'Entiendo tu consulta. Para brindarte mejor atención, puedes usar las opciones rápidas o contactar a nuestro centro de atención al cliente al 01 800 CORREOS.';
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

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
    }, 1500);
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
    lineHeight: 20,
  },
  botMessageText: {
    color: '#333333',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
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
  paddingHorizontal: 8,    // era 16
  paddingVertical: 5,      // era 10
  backgroundColor: '#FAFAFA',
},
  quickReplyButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 15,
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickReplyIcon: {
    fontSize: 14
    ,
    marginRight: 6,
  },
  quickReplyText: {
    fontSize: 12,
    color: '#DE1484',
    fontWeight: '500',
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