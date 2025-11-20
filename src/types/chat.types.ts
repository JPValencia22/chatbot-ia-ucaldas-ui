// src/types/chat.types.ts
// Definiciones de tipos para el ChatBot IA

/**
 * Tipo de rol en el mensaje
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Tipo de estado del mensaje
 */
export type MessageStatus = 'sending' | 'sent' | 'error';

/**
 * Modo de respuesta del ChatBot
 */
export type ResponseMode = 'breve' | 'extendido';

/**
 * Interfaz para una cita/fuente individual
 */
export interface Citation {
  doc_nombre: string;
  doc_index: number;
  chunk_index: number;
  chunk_text: string;
  score: number;
}

/**
 * Interfaz para un mensaje del chat
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
  citations?: Citation[];
  metadata?: MessageMetadata;
}

/**
 * Metadata asociada a un mensaje
 */
export interface MessageMetadata {
  num_chunks_recuperados?: number;
  modelo_usado?: string;
  tokens_consumidos?: number;
  latencia_ms?: number;
  tiene_citas?: boolean;
}

/**
 * Estado del chat en Redux
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentResponseMode: ResponseMode;
}

/**
 * Request al webhook de N8N
 */
export interface ChatRequest {
  pregunta: string;
  modo: ResponseMode;
  historial?: ConversationHistoryItem[];
}

/**
 * Item del historial de conversación
 */
export interface ConversationHistoryItem {
  rol: MessageRole;
  contenido: string;
}

/**
 * Response del webhook de N8N
 */
export interface ChatResponse {
  respuesta: string;
  fuentes: Citation[];
  metadata: {
    num_chunks_recuperados: number;
    modelo_usado: string;
    tokens_consumidos: number;
    latencia_ms: number;
  };
  no_tiene_informacion?: boolean;
  error?: string;
}

/**
 * Props para componente MessageBubble
 */
export interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

/**
 * Props para componente CitationDisplay
 */
export interface CitationDisplayProps {
  citations: Citation[];
}

/**
 * Props para componente SourcesPanel
 */
export interface SourcesPanelProps {
  sources: Citation[];
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Props para componente ResponseModeToggle
 */
export interface ResponseModeToggleProps {
  currentMode: ResponseMode;
  onModeChange: (mode: ResponseMode) => void;
}

/**
 * Props para componente WelcomeScreen
 */
export interface WelcomeScreenProps {
  onExampleClick: (question: string) => void;
}

/**
 * Ejemplo de pregunta para la pantalla de bienvenida
 */
export interface ExampleQuestion {
  category: string;
  question: string;
  icon: string;
}

/**
 * Configuración de temas de ejemplo
 */
export const EXAMPLE_QUESTIONS: ExampleQuestion[] = [
  {
    category: "Conceptos Básicos",
    question: "¿Qué es la Inteligencia Artificial?",
    icon: "🧠"
  },
  {
    category: "Historia",
    question: "¿Cuándo surgió el concepto de Inteligencia Artificial?",
    icon: "📚"
  },
  {
    category: "Machine Learning",
    question: "¿Qué diferencia hay entre Machine Learning y Deep Learning?",
    icon: "🤖"
  },
  {
    category: "Deep Learning",
    question: "¿Qué son los modelos de lenguaje grandes (LLMs)?",
    icon: "💬"
  },
  {
    category: "Ética y Regulación",
    question: "¿Qué es el AI Act europeo?",
    icon: "⚖️"
  },
  {
    category: "Aplicaciones",
    question: "¿Cuáles son las aplicaciones prácticas de la IA en Colombia?",
    icon: "🌎"
  }
];

/**
 * Configuración del ChatBot
 */
export interface ChatConfig {
  maxMessageLength: number;
  maxMessagesInHistory: number;
  responseTimeout: number; // en ms
  retryAttempts: number;
  retryDelay: number; // en ms
}

/**
 * Configuración por defecto
 */
export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  maxMessageLength: 500,
  maxMessagesInHistory: 20,
  responseTimeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 1000 // 1 segundo
};

/**
 * Tipos de error personalizado
 */
export enum ChatErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NO_INFORMATION = 'NO_INFORMATION'
}

/**
 * Interfaz para errores del chat
 */
export interface ChatError {
  type: ChatErrorType;
  message: string;
  originalError?: Error;
  timestamp: Date;
}

/**
 * Utilidad para crear mensajes
 */
export const createMessage = (
  role: MessageRole,
  content: string,
  citations?: Citation[],
  metadata?: MessageMetadata
): Message => {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: new Date(),
    status: role === 'user' ? 'sending' : 'sent',
    citations,
    metadata
  };
};

/**
 * Utilidad para crear mensaje de error
 */
export const createErrorMessage = (errorType: ChatErrorType): Message => {
  const errorMessages: Record<ChatErrorType, string> = {
    [ChatErrorType.NETWORK_ERROR]: 
      "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.",
    [ChatErrorType.TIMEOUT_ERROR]: 
      "La consulta tomó demasiado tiempo. Intenta con una pregunta más específica.",
    [ChatErrorType.VALIDATION_ERROR]: 
      "La pregunta no es válida. Asegúrate de no exceder los 500 caracteres.",
    [ChatErrorType.SERVER_ERROR]: 
      "Ocurrió un error en el servidor. Por favor, intenta de nuevo en unos momentos.",
    [ChatErrorType.NO_INFORMATION]: 
      "Lo siento, no tengo información suficiente sobre ese tema en mi base de conocimientos. Te recomiendo consultar directamente con un profesor o revisar la documentación oficial."
  };

  return createMessage('system', errorMessages[errorType]);
};

/**
 * Utilidad para parsear citas del texto de respuesta
 * Formato esperado: [Fuente: documento.pdf | Chunk: 42]
 */
export const parseCitationsFromText = (text: string): string[] => {
  const citationRegex = /\[Fuente:\s*([^\|]+)\s*\|\s*Chunk:\s*(\d+)\]/g;
  const matches = text.matchAll(citationRegex);
  const citations: string[] = [];
  
  for (const match of matches) {
    citations.push(match[0]);
  }
  
  return citations;
};

/**
 * Utilidad para verificar si un mensaje tiene citas
 */
export const hasCitations = (message: Message): boolean => {
  return !!(message.citations && message.citations.length > 0);
};

/**
 * Utilidad para formatear fecha del mensaje
 */
export const formatMessageTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // Menos de 1 minuto
  if (diff < 60000) {
    return 'Justo ahora';
  }
  
  // Menos de 1 hora
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  // Menos de 24 horas
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
  // Más de 24 horas - mostrar fecha
  return timestamp.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Utilidad para calcular score promedio de citas
 */
export const getAverageCitationScore = (citations: Citation[]): number => {
  if (!citations || citations.length === 0) return 0;
  
  const sum = citations.reduce((acc, citation) => acc + citation.score, 0);
  return sum / citations.length;
};

/**
 * Utilidad para truncar texto largo
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};