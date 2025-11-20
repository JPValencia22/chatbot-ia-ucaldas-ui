// src/types/n8n.types.ts
// Definiciones de tipos para las respuestas de N8N workflows

/**
 * Estructura del chunk almacenado en Pinecone
 */
export interface PineconeChunk {
  doc_id: string;
  doc_nombre: string;
  doc_index: number;
  chunk_index: number;
  chunk_text: string;
  chunk_length: number;
  doc_tipo?: string;
  doc_fuente?: string;
  doc_fecha?: string;
}

/**
 * Resultado de búsqueda en Pinecone
 */
export interface PineconeSearchResult {
  id: string;
  score: number;
  values?: number[];
  metadata: PineconeChunk;
}

/**
 * Response del workflow 01_Preparar_Corpus
 */
export interface PrepararCorpusResponse {
  success: boolean;
  mensaje: string;
  documentos_procesados: number;
  chunks_creados: number;
  chunks_insertados_pinecone: number;
  errores?: string[];
  tiempo_ejecucion_ms: number;
}

/**
 * Response del workflow 02_Consulta_RAG
 */
export interface ConsultaRAGResponse {
  success: boolean;
  respuesta: string;
  fuentes: Array<{
    doc_nombre: string;
    doc_index: number;
    chunk_index: number;
    chunk_text: string;
    score: number;
  }>;
  metadata: {
    num_chunks_recuperados: number;
    modelo_usado: string;
    tokens_consumidos: number;
    latencia_ms: number;
    temperature: number;
    max_tokens: number;
  };
  no_tiene_informacion?: boolean;
  error?: string;
  timestamp: string;
}

/**
 * Response del workflow 03_Evaluacion_Gold
 */
export interface EvaluacionGoldResponse {
  success: boolean;
  mensaje: string;
  total_preguntas: number;
  preguntas_evaluadas: number;
  metricas_globales: {
    score_global: number;
    tasa_alucinacion: number;
    tasa_citas: number;
    ifa: number;
    exactitud_promedio: number;
    cobertura_promedio: number;
    claridad_promedio: number;
  };
  cumple_criterios: {
    score_mayor_070: boolean;
    alucinacion_menor_010: boolean;
    citas_mayor_085: boolean;
    ifa_mayor_075: boolean;
  };
  tiempo_ejecucion_s: number;
  archivo_resultados: string;
}

/**
 * Pregunta individual del conjunto gold
 */
export interface GoldQuestion {
  pregunta_id: number;
  categoria: 
    | 'conceptos_basicos' 
    | 'historia' 
    | 'ml_clasico' 
    | 'deep_learning_llms' 
    | 'etica_regulacion' 
    | 'aplicaciones';
  pregunta: string;
  respuesta_esperada?: string;
  keywords_esperados?: string[];
  fuentes_esperadas?: string[];
}

/**
 * Resultado de evaluación de una pregunta individual
 */
export interface PreguntaEvaluacionResult {
  pregunta_id: number;
  categoria: string;
  pregunta: string;
  respuesta_generada: string;
  fuentes_recuperadas: Array<{
    doc_nombre: string;
    chunk_index: number;
    score: number;
  }>;
  metricas: {
    exactitud: number;
    cobertura: number;
    claridad: number;
    citas: number;
    alucinacion: number;
    seguridad: number;
    score_r: number;
  };
  tiene_citas: boolean;
  es_alucinacion: boolean;
  tokens_consumidos: number;
  latencia_ms: number;
}

/**
 * Estructura del embedding de OpenAI
 */
export interface OpenAIEmbedding {
  object: 'embedding';
  embedding: number[];
  index: number;
}

/**
 * Response de OpenAI Embeddings API
 */
export interface OpenAIEmbeddingsResponse {
  object: 'list';
  data: OpenAIEmbedding[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Mensaje en el formato de OpenAI Chat
 */
export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Request a OpenAI Chat Completions
 */
export interface OpenAIChatRequest {
  model: string;
  messages: OpenAIChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

/**
 * Choice individual de OpenAI
 */
export interface OpenAIChatChoice {
  index: number;
  message: OpenAIChatMessage;
  finish_reason: 'stop' | 'length' | 'content_filter' | null;
}

/**
 * Response de OpenAI Chat Completions
 */
export interface OpenAIChatResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: OpenAIChatChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Configuración de Pinecone
 */
export interface PineconeConfig {
  apiKey: string;
  environment: string;
  indexName: string;
  namespace?: string;
  dimensions: number;
  metric: 'cosine' | 'euclidean' | 'dotproduct';
}

/**
 * Configuración de OpenAI
 */
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  embeddingModel: string;
  embeddingDimensions: number;
  temperature: number;
  maxTokens: number;
}

/**
 * Configuración completa del sistema RAG
 */
export interface RAGSystemConfig {
  pinecone: PineconeConfig;
  openai: OpenAIConfig;
  chunking: {
    chunkSize: number;
    chunkOverlap: number;
  };
  retrieval: {
    topK: number;
    minScore: number;
  };
  generation: {
    systemPrompt: string;
    responseFormat: 'breve' | 'extendido';
  };
}

/**
 * Configuración por defecto del sistema
 */
export const DEFAULT_RAG_CONFIG: RAGSystemConfig = {
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: 'aped-4627-b74a',
    indexName: 'chatbot-ia-ucaldas',
    namespace: 'default',
    dimensions: 1536,
    metric: 'cosine'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    embeddingModel: 'text-embedding-3-small',
    embeddingDimensions: 1536,
    temperature: 0.3,
    maxTokens: 500
  },
  chunking: {
    chunkSize: 2400,
    chunkOverlap: 400
  },
  retrieval: {
    topK: 5,
    minScore: 0.70
  },
  generation: {
    systemPrompt: `Eres un asistente experto en Inteligencia Artificial de la Universidad de Caldas. 
Tu función es responder preguntas de forma precisa y fundamentada, siempre citando las fuentes.
Si no tienes información suficiente, debes ser honesto y decirlo.`,
    responseFormat: 'extendido'
  }
};

/**
 * Estado de un workflow de N8N
 */
export enum WorkflowStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

/**
 * Metadata de ejecución de un workflow
 */
export interface WorkflowExecutionMetadata {
  workflowId: string;
  workflowName: string;
  executionId: string;
  status: WorkflowStatus;
  startTime: string;
  endTime?: string;
  durationMs?: number;
  error?: string;
}

/**
 * Log entry para registro de actividad
 */
export interface ActivityLogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  workflow: string;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Estadísticas de uso del sistema
 */
export interface SystemUsageStats {
  total_consultas: number;
  consultas_exitosas: number;
  consultas_fallidas: number;
  tokens_totales_consumidos: number;
  latencia_promedio_ms: number;
  documentos_en_corpus: number;
  chunks_en_pinecone: number;
  ultima_actualizacion: string;
}

/**
 * Health check del sistema
 */
export interface SystemHealthCheck {
  status: 'healthy' | 'degraded' | 'down';
  components: {
    n8n: 'up' | 'down';
    pinecone: 'up' | 'down';
    openai: 'up' | 'down';
  };
  latency_ms: {
    n8n: number;
    pinecone: number;
    openai: number;
  };
  timestamp: string;
}

/**
 * Utilidad para validar response de N8N
 */
export const isValidConsultaRAGResponse = (
  response: any
): response is ConsultaRAGResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.success === 'boolean' &&
    typeof response.respuesta === 'string' &&
    Array.isArray(response.fuentes) &&
    typeof response.metadata === 'object'
  );
};

/**
 * Utilidad para validar PineconeSearchResult
 */
export const isValidPineconeResult = (
  result: any
): result is PineconeSearchResult => {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.id === 'string' &&
    typeof result.score === 'number' &&
    typeof result.metadata === 'object'
  );
};

/**
 * Utilidad para crear timestamp ISO
 */
export const createISOTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Utilidad para parsear timestamp de N8N
 */
export const parseN8NTimestamp = (timestamp: string): Date => {
  return new Date(timestamp);
};

/**
 * Constantes de timeouts
 */
export const N8N_TIMEOUTS = {
  PREPARAR_CORPUS: 300000, // 5 minutos (puede ser largo)
  CONSULTA_RAG: 30000,     // 30 segundos
  EVALUACION_GOLD: 600000  // 10 minutos (60 preguntas)
} as const;

/**
 * Constantes de retry
 */
export const N8N_RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,      // 1 segundo
  BACKOFF_MULTIPLIER: 2   // 2x cada retry
} as const;