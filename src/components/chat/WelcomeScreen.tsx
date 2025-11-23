// src/components/chat/WelcomeScreen.tsx
// Pantalla de bienvenida con ejemplos de preguntas

import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import type { WelcomeScreenProps } from '../../types/chat.types';
import { EXAMPLE_QUESTIONS } from '../../types/chat.types';

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header de bienvenida */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido al ChatBot de IA
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Soy tu asistente especializado en Inteligencia Artificial de la Universidad de Caldas.
          Respondo preguntas con información verificada y citas de fuentes confiables.
        </p>
      </div>

      {/* Características */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          ¿Qué puedo hacer?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              ✅
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Respuestas verificadas</p>
              <p className="text-xs text-gray-600">
                Todas mis respuestas están basadas en documentos confiables
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              📚
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Citas verificables</p>
              <p className="text-xs text-gray-600">
                Incluyo referencias a las fuentes originales
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              🎯
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Sin alucinaciones</p>
              <p className="text-xs text-gray-600">
                Si no tengo info suficiente, te lo diré honestamente
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              ⚡
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Respuestas rápidas</p>
              <p className="text-xs text-gray-600">
                Modo breve o extendido según tu necesidad
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ejemplos de preguntas */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pregunta algo como:
        </h2>
        
        <div className="grid md:grid-cols-2 gap-3">
          {EXAMPLE_QUESTIONS.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 justify-start text-left hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              onClick={() => onExampleClick(example.question)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 text-2xl">
                  {example.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 uppercase">
                    {example.category}
                  </p>
                  <p className="text-sm text-gray-900 group-hover:text-blue-700">
                    {example.question}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Temas cubiertos */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Temas que puedo cubrir:
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {[
            'Conceptos de IA',
            'Historia de la IA',
            'Machine Learning',
            'Deep Learning',
            'Modelos de Lenguaje (LLMs)',
            'Redes Neuronales',
            'Ética en IA',
            'Regulación (AI Act)',
            'CONPES Colombia',
            'Aplicaciones prácticas',
            'Universidad de Caldas',
            'Programas académicos',
          ].map((tema, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-300"
            >
              {tema}
            </span>
          ))}
        </div>
      </Card>

      {/* Call to action */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          👇 Empieza escribiendo tu pregunta en el campo de texto de abajo
        </p>
      </div>
    </div>
  );
};