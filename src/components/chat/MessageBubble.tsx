// src/components/chat/MessageBubble.tsx
// Componente para burbujas de mensaje individuales

import React from 'react';
import { User, Bot, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CitationDisplay } from './CitationDisplay';
import type { MessageBubbleProps } from '../../types/chat.types';
import { formatMessageTimestamp, hasCitations } from '../../types/chat.types';

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const isSystem = message.role === 'system';

  /**
   * Renderizar mensaje del sistema (errores, avisos)
   */
  if (isSystem) {
    return (
      <Card className="bg-yellow-50 border-yellow-200 p-4 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-900 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  /**
   * Renderizar mensaje de usuario
   */
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-2xl">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-400/30">
              <span className="text-xs text-blue-100">
                {formatMessageTimestamp(message.timestamp)}
              </span>
              
              {message.status === 'sending' && (
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-100">
                  Enviando...
                </Badge>
              )}
              
              {message.status === 'error' && (
                <Badge variant="destructive" className="text-xs">
                  Error al enviar
                </Badge>
              )}
            </div>
          </Card>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renderizar mensaje del ChatBot
   */
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-2xl">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        
        <Card className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
          {/* Contenido del mensaje */}
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* Citas si existen */}
          {hasCitations(message) && message.citations && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <CitationDisplay citations={message.citations} />
            </div>
          )}

          {/* Metadata y timestamp */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatMessageTimestamp(message.timestamp)}</span>
              
              {message.metadata?.modelo_usado && (
                <>
                  <span>•</span>
                  <span>{message.metadata.modelo_usado}</span>
                </>
              )}
              
              {message.metadata?.tokens_consumidos && (
                <>
                  <span>•</span>
                  <span>{message.metadata.tokens_consumidos} tokens</span>
                </>
              )}
              
              {message.metadata?.latencia_ms && (
                <>
                  <span>•</span>
                  <span>{message.metadata.latencia_ms}ms</span>
                </>
              )}
            </div>

            {/* Indicador de citas */}
            {hasCitations(message) && (
              <Badge variant="secondary" className="text-xs">
                ✓ Con citas
              </Badge>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};