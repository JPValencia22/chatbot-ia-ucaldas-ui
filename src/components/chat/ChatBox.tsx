// src/components/chat/ChatBox.tsx
// Componente principal del chat

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MessageBubble } from './MessageBubble';
import { SourcesPanel } from './SourcesPanel';
import { ResponseModeToggle } from './ResponseModeToggle';
import { WelcomeScreen } from './WelcomeScreen';
import {
  sendMessage,
  addWelcomeMessage,
  clearError,
  selectMessages,
  selectIsLoading,
  selectError,
  selectResponseMode,
  selectHasMessages,
} from '../../store/slices/chatSlice';
import type { AppDispatch } from '../../store';
import type { Citation } from '../../types/chat.types';

export const ChatBox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectores de Redux
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const responseMode = useSelector(selectResponseMode);
  const hasMessages = useSelector(selectHasMessages);

  // Estado local
  const [inputValue, setInputValue] = useState('');
  const [showSources, setShowSources] = useState(false);
  const [currentSources, setCurrentSources] = useState<Citation[]>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-scroll al último mensaje
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Agregar mensaje de bienvenida al montar
   */
  useEffect(() => {
    if (!hasMessages) {
      dispatch(addWelcomeMessage());
    }
  }, [dispatch, hasMessages]);

  /**
   * Focus en input cuando deja de cargar
   */
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  /**
   * Actualizar fuentes cuando llega un nuevo mensaje con citas
   */
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.citations) {
      setCurrentSources(lastMessage.citations);
    }
  }, [messages]);

  /**
   * Limpiar error después de 5 segundos
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  /**
   * Manejar envío de mensaje
   */
  const handleSendMessage = async () => {
    const trimmedValue = inputValue.trim();

    // Validar input
    if (!trimmedValue) return;

    if (trimmedValue.length > 500) {
      alert('La pregunta no puede exceder 500 caracteres');
      return;
    }

    // Limpiar input
    setInputValue('');

    // Dispatch async thunk
    try {
      await dispatch(sendMessage(trimmedValue)).unwrap();
    } catch (error) {
      // El error ya se maneja en el slice
      console.error('Error al enviar mensaje:', error);
    }
  };

  /**
   * Manejar tecla Enter
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Manejar clic en pregunta de ejemplo
   */
  const handleExampleClick = (question: string) => {
    setInputValue(question);
    // Opcional: enviar automáticamente
    // handleSendMessage();
  };

  /**
   * Contar caracteres del input
   */
  const charCount = inputValue.length;
  const charCountColor = charCount > 400 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Panel principal del chat */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  ChatBot IA - Universidad de Caldas
                </h1>
                <p className="text-sm text-gray-500">
                  Respuestas verificadas con citas de fuentes confiables
                </p>
              </div>
            </div>
            
            {/* Toggle de modo de respuesta */}
            <ResponseModeToggle />
          </div>
        </header>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!hasMessages && <WelcomeScreen onExampleClick={handleExampleClick} />}
          
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}

          {/* Indicador de "escribiendo..." */}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">El ChatBot está escribiendo...</span>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Anchor para auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Escribe tu pregunta sobre Inteligencia Artificial..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1 px-1">
                <p className="text-xs text-gray-500">
                  Presiona Enter para enviar
                </p>
                <p className={`text-xs ${charCountColor}`}>
                  {charCount}/500
                </p>
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Info adicional */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>Modo: {responseMode === 'breve' ? 'Breve' : 'Extendido'}</span>
            <span>•</span>
            <span>{messages.filter(m => m.role !== 'system').length} mensajes</span>
            {currentSources.length > 0 && (
              <>
                <span>•</span>
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="underline hover:text-blue-600"
                >
                  {currentSources.length} fuentes consultadas
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Panel lateral de fuentes */}
      <SourcesPanel
        sources={currentSources}
        isOpen={showSources}
        onToggle={() => setShowSources(!showSources)}
      />
    </div>
  );
};