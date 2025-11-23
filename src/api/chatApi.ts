// src/api/chatApi.ts
// API para interactuar con workflows de N8N

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ChatRequest,
  ChatResponse,
  ChatError,
  ConversationHistoryItem,
  ChatErrorType
} from '../types/chat.types';
import type {
  ConsultaRAGResponse
} from '../types/n8n.types';

/**
 * Configuración de la instancia de Axios para N8N
 */
const createN8NClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: 30000, // 30 segundos por defecto
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor de request para logging (desarrollo)
  client.interceptors.request.use(
    (config) => {
      if (import.meta.env.DEV) {
        console.log('[N8N API] Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
        });
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de response para logging y manejo de errores
  client.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        console.log('[N8N API] Response:', {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error) => {
      if (import.meta.env.DEV) {
        console.error('[N8N API] Error:', error);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const n8nClient = createN8NClient();

/**
 * Obtener URL del webhook de N8N desde variables de entorno
 */
const getWebhookURL = (): string => {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!url) {
    throw new Error(
      'VITE_N8N_WEBHOOK_URL no está configurada en las variables de entorno. ' +
      'Por favor, agrega esta variable en tu archivo .env'
    );
  }

  return url;
};

/**
 * Transformar error de Axios a ChatError
 */
const transformAxiosError = (error: AxiosError): ChatError => {
  let errorType: ChatErrorType;
  let message: string;

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    errorType = ChatErrorType.TIMEOUT_ERROR;
    message = 'La consulta tomó demasiado tiempo. Intenta con una pregunta más específica.';
  } else if (error.response) {
    // El servidor respondió con un código de error
    errorType = ChatErrorType.SERVER_ERROR;
    const errorData = error.response.data as { error?: string };
    message = `Error del servidor (${error.response.status}): ${errorData?.error || 'Error desconocido'
      }`;
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    errorType = ChatErrorType.NETWORK_ERROR;
    message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  } else {
    // Algo pasó al configurar la petición
    errorType = ChatErrorType.SERVER_ERROR;
    message = 'Ocurrió un error inesperado al procesar tu solicitud.';
  }

  return {
    type: errorType,
    message,
    originalError: error as Error,
    timestamp: new Date(),
  };
};

/**
 * Validar que la respuesta de N8N tiene el formato esperado
 */
const validateN8NResponse = (data: any): data is ConsultaRAGResponse => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.success === 'boolean' &&
    typeof data.respuesta === 'string' &&
    Array.isArray(data.fuentes) &&
    data.metadata &&
    typeof data.metadata === 'object'
  );
};

/**
 * Construir historial de conversación en el formato esperado por N8N
 */
const buildConversationHistory = (
  messages: Array<{ role: string; content: string }>
): ConversationHistoryItem[] => {
  // Solo incluir últimos 10 mensajes para no exceder límites
  const recentMessages = messages.slice(-10);

  return recentMessages.map((msg) => ({
    rol: msg.role as 'user' | 'assistant' | 'system',
    contenido: msg.content,
  }));
};

/**
 * Enviar consulta al ChatBot vía webhook de N8N
 */
export const sendChatMessage = async (
  pregunta: string,
  modo: 'breve' | 'extendido' = 'extendido',
  historial?: Array<{ role: string; content: string }>
): Promise<ChatResponse> => {
  try {
    // Validar longitud del mensaje
    if (pregunta.length === 0) {
      throw {
        type: ChatErrorType.VALIDATION_ERROR,
        message: 'La pregunta no puede estar vacía',
        timestamp: new Date(),
      } as ChatError;
    }

    if (pregunta.length > 500) {
      throw {
        type: ChatErrorType.VALIDATION_ERROR,
        message: 'La pregunta no puede exceder 500 caracteres',
        timestamp: new Date(),
      } as ChatError;
    }

    // Construir payload
    const payload: ChatRequest = {
      pregunta: pregunta.trim(),
      modo,
    };

    // Agregar historial si existe
    if (historial && historial.length > 0) {
      payload.historial = buildConversationHistory(historial);
    }

    // Realizar petición
    const response = await n8nClient.post<ConsultaRAGResponse>(
      getWebhookURL(),
      payload,
      {
        timeout: 30000, // 30 segundos
      }
    );

    // Validar respuesta
    if (!validateN8NResponse(response.data)) {
      throw {
        type: ChatErrorType.SERVER_ERROR,
        message: 'La respuesta del servidor tiene un formato inválido',
        timestamp: new Date(),
      } as ChatError;
    }

    // Verificar si N8N indica que no tiene información
    if (response.data.no_tiene_informacion) {
      throw {
        type: ChatErrorType.NO_INFORMATION,
        message: 'Lo siento, no tengo información suficiente sobre ese tema en mi base de conocimientos.',
        timestamp: new Date(),
      } as ChatError;
    }

    // Verificar si N8N devolvió un error explícito
    if (response.data.error) {
      throw {
        type: ChatErrorType.SERVER_ERROR,
        message: response.data.error,
        timestamp: new Date(),
      } as ChatError;
    }

    // Transformar respuesta al formato del frontend
    return {
      respuesta: response.data.respuesta,
      fuentes: response.data.fuentes.map((fuente) => ({
        doc_nombre: fuente.doc_nombre,
        doc_index: fuente.doc_index,
        chunk_index: fuente.chunk_index,
        chunk_text: fuente.chunk_text,
        score: fuente.score,
      })),
      metadata: {
        num_chunks_recuperados: response.data.metadata.num_chunks_recuperados,
        modelo_usado: response.data.metadata.modelo_usado,
        tokens_consumidos: response.data.metadata.tokens_consumidos,
        latencia_ms: response.data.metadata.latencia_ms,
      },
    };
  } catch (error) {
    // Si ya es un ChatError, re-lanzarlo
    if ((error as ChatError).type) {
      throw error;
    }

    // Si es un error de Axios, transformarlo
    if (axios.isAxiosError(error)) {
      throw transformAxiosError(error);
    }

    // Error desconocido
    throw {
      type: ChatErrorType.SERVER_ERROR,
      message: 'Ocurrió un error inesperado',
      originalError: error as Error,
      timestamp: new Date(),
    } as ChatError;
  }
};

/**
 * Verificar conectividad con N8N (health check)
 */
export const checkN8NConnection = async (): Promise<boolean> => {
  try {
    // Hacer una petición simple de prueba
    const response = await n8nClient.post(
      getWebhookURL(),
      {
        pregunta: 'test',
        modo: 'breve',
      },
      {
        timeout: 5000, // 5 segundos para health check
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('[N8N Health Check] Failed:', error);
    return false;
  }
};

/**
 * Función helper para retry con backoff exponencial
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // No reintentar para ciertos tipos de error
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          throw error;
        }
      }

      if (i < maxRetries - 1) {
        // Esperar con backoff exponencial
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        console.log(`[Retry] Attempt ${i + 2} of ${maxRetries}`);
      }
    }
  }

  throw lastError!;
};

/**
 * Enviar consulta con reintentos automáticos
 */
export const sendChatMessageWithRetry = async (
  pregunta: string,
  modo: 'breve' | 'extendido' = 'extendido',
  historial?: Array<{ role: string; content: string }>
): Promise<ChatResponse> => {
  return retryWithBackoff(
    () => sendChatMessage(pregunta, modo, historial),
    3,  // 3 reintentos
    1000 // 1 segundo de delay inicial
  );
};

/**
 * Cancelar petición en curso (útil para cleanup en useEffect)
 */
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * Verificar si un error es de cancelación
 */
export const isCancelError = (error: any): boolean => {
  return axios.isCancel(error);
};

/**
 * Obtener estadísticas de uso (si N8N lo implementa)
 * Esta función es opcional y depende de que N8N tenga un endpoint para esto
 */
export const getUsageStats = async (): Promise<{
  total_consultas: number;
  tokens_consumidos: number;
  latencia_promedio: number;
} | null> => {
  try {
    const statsURL = import.meta.env.VITE_N8N_STATS_URL;

    if (!statsURL) {
      console.warn('VITE_N8N_STATS_URL no configurada');
      return null;
    }

    const response = await n8nClient.get(statsURL);
    return response.data;
  } catch (error) {
    console.error('[Usage Stats] Error:', error);
    return null;
  }
};

/**
 * Exportar cliente de Axios por si se necesita usar directamente
 */
export { n8nClient };

/**
 * Configuración y constantes exportadas
 */
export const API_CONFIG = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_MESSAGE_LENGTH: 500,
  MAX_HISTORY_MESSAGES: 10,
} as const;