// src/store/slices/chatSlice.ts
// Redux slice para gestionar el estado del chat

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatState,
  Message,
  MessageRole,
  ResponseMode,
  Citation,
  MessageMetadata,
  ChatError,
  ChatErrorType,
} from '../../types/chat.types';
import { sendChatMessageWithRetry } from '../../api/chatApi';
import { createMessage, createErrorMessage } from '../../types/chat.types';

/**
 * Estado inicial del chat
 */
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  currentResponseMode: 'extendido',
};

/**
 * Async thunk para enviar mensaje al ChatBot
 */
export const sendMessage = createAsyncThunk<
  {
    respuesta: string;
    fuentes: Citation[];
    metadata: MessageMetadata;
  },
  string,
  {
    state: { chat: ChatState };
    rejectValue: ChatError;
  }
>(
  'chat/sendMessage',
  async (pregunta, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { currentResponseMode, messages } = state.chat;

      // Construir historial (solo últimos 10 mensajes para contexto)
      const historial = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Enviar mensaje con reintentos
      const response = await sendChatMessageWithRetry(
        pregunta,
        currentResponseMode,
        historial
      );

      return {
        respuesta: response.respuesta,
        fuentes: response.fuentes,
        metadata: response.metadata,
      };
    } catch (error) {
      // Si es un ChatError, devolverlo directamente
      if ((error as ChatError).type) {
        return rejectWithValue(error as ChatError);
      }

      // Error desconocido
      return rejectWithValue({
        type: ChatErrorType.SERVER_ERROR,
        message: 'Ocurrió un error inesperado al procesar tu mensaje',
        timestamp: new Date(),
      });
    }
  }
);

/**
 * Slice del chat
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * Agregar mensaje manual (ej. mensaje del usuario)
     */
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    /**
     * Cambiar modo de respuesta
     */
    setResponseMode: (state, action: PayloadAction<ResponseMode>) => {
      state.currentResponseMode = action.payload;
    },

    /**
     * Limpiar historial de mensajes
     */
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },

    /**
     * Eliminar un mensaje específico
     */
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },

    /**
     * Actualizar estado de un mensaje
     */
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'sending' | 'sent' | 'error' }>
    ) => {
      const message = state.messages.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.status = action.payload.status;
      }
    },

    /**
     * Limpiar error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Agregar mensaje de bienvenida
     */
    addWelcomeMessage: (state) => {
      const welcomeMessage = createMessage(
        'assistant',
        `¡Hola! Soy el ChatBot de Inteligencia Artificial de la Universidad de Caldas. 
        
Estoy aquí para responder tus preguntas sobre IA con información verificada de fuentes confiables.

Puedes preguntarme sobre:
• Conceptos fundamentales de IA
• Historia y evolución del campo
• Machine Learning y Deep Learning
• Modelos de lenguaje grandes (LLMs)
• Ética y regulación de la IA
• Aplicaciones prácticas

**Todas mis respuestas incluyen citas de las fuentes consultadas** para que puedas verificar la información.

¿Qué te gustaría saber?`
      );
      state.messages.push(welcomeMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      // Cuando se envía un mensaje
      .addCase(sendMessage.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;

        // Agregar mensaje del usuario
        const userMessage = createMessage('user', action.meta.arg);
        state.messages.push(userMessage);
      })

      // Cuando se recibe la respuesta
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;

        // Actualizar último mensaje de usuario como "enviado"
        const lastUserMessage = [...state.messages]
          .reverse()
          .find((msg) => msg.role === 'user');
        if (lastUserMessage) {
          lastUserMessage.status = 'sent';
        }

        // Agregar mensaje del ChatBot con citas
        const assistantMessage = createMessage(
          'assistant',
          action.payload.respuesta,
          action.payload.fuentes,
          action.payload.metadata
        );
        state.messages.push(assistantMessage);
      })

      // Cuando hay un error
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;

        // Actualizar último mensaje de usuario como "error"
        const lastUserMessage = [...state.messages]
          .reverse()
          .find((msg) => msg.role === 'user');
        if (lastUserMessage) {
          lastUserMessage.status = 'error';
        }

        // Guardar error en el estado
        if (action.payload) {
          state.error = action.payload.message;

          // Agregar mensaje de error visual
          const errorMessage = createErrorMessage(action.payload.type);
          state.messages.push(errorMessage);
        } else {
          state.error = 'Ocurrió un error desconocido';
        }
      });
  },
});

// Exportar acciones
export const {
  addMessage,
  setResponseMode,
  clearMessages,
  removeMessage,
  updateMessageStatus,
  clearError,
  addWelcomeMessage,
} = chatSlice.actions;

// Selectores
export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectIsLoading = (state: { chat: ChatState }) => state.chat.isLoading;
export const selectError = (state: { chat: ChatState }) => state.chat.error;
export const selectResponseMode = (state: { chat: ChatState }) =>
  state.chat.currentResponseMode;

// Selector para obtener último mensaje
export const selectLastMessage = (state: { chat: ChatState }) => {
  const messages = state.chat.messages;
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

// Selector para obtener mensajes del usuario
export const selectUserMessages = (state: { chat: ChatState }) =>
  state.chat.messages.filter((msg) => msg.role === 'user');

// Selector para obtener mensajes del asistente
export const selectAssistantMessages = (state: { chat: ChatState }) =>
  state.chat.messages.filter((msg) => msg.role === 'assistant');

// Selector para contar mensajes
export const selectMessageCount = (state: { chat: ChatState }) =>
  state.chat.messages.length;

// Selector para verificar si hay mensajes
export const selectHasMessages = (state: { chat: ChatState }) =>
  state.chat.messages.length > 0;

// Selector para obtener estadísticas
export const selectChatStats = (state: { chat: ChatState }) => {
  const messages = state.chat.messages;
  const assistantMessages = messages.filter((msg) => msg.role === 'assistant');
  
  const totalTokens = assistantMessages.reduce(
    (sum, msg) => sum + (msg.metadata?.tokens_consumidos || 0),
    0
  );
  
  const avgLatency = assistantMessages.length > 0
    ? assistantMessages.reduce(
        (sum, msg) => sum + (msg.metadata?.latencia_ms || 0),
        0
      ) / assistantMessages.length
    : 0;
  
  const messagesWithCitations = assistantMessages.filter(
    (msg) => msg.citations && msg.citations.length > 0
  ).length;
  
  return {
    totalMessages: messages.length,
    userMessages: messages.filter((msg) => msg.role === 'user').length,
    assistantMessages: assistantMessages.length,
    totalTokensConsumed: totalTokens,
    averageLatency: Math.round(avgLatency),
    messagesWithCitations,
    citationRate: assistantMessages.length > 0
      ? (messagesWithCitations / assistantMessages.length) * 100
      : 0,
  };
};

export default chatSlice.reducer;