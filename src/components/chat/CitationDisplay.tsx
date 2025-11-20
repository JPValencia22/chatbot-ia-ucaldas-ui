// src/components/chat/CitationDisplay.tsx
// Componente para mostrar citas de fuentes

import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { CitationDisplayProps } from '../../types/chat.types';

export const CitationDisplay: React.FC<CitationDisplayProps> = ({ citations }) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-indigo-600" />
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Fuentes Consultadas ({citations.length})
        </p>
      </div>

      <div className="space-y-2">
        {citations.map((citation, index) => (
          <div
            key={`${citation.doc_nombre}-${citation.chunk_index}`}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-colors"
          >
            {/* Header de la cita */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {citation.doc_nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    Chunk #{citation.chunk_index}
                  </p>
                </div>
              </div>
              
              {/* Score de similitud */}
              <Badge 
                variant="outline" 
                className="text-xs flex-shrink-0"
              >
                {(citation.score * 100).toFixed(1)}%
              </Badge>
            </div>

            {/* Fragmento del texto */}
            <div className="mt-2 pl-6">
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                "{citation.chunk_text}"
              </p>
            </div>

            {/* Formato de citación formal */}
            <div className="mt-2 pl-6">
              <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                [Fuente: {citation.doc_nombre} | Chunk: {citation.chunk_index}]
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* Info adicional sobre las citas */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-800">
          <span className="font-medium">💡 Nota:</span> Las citas son fragmentos extraídos directamente de los documentos en nuestra base de conocimientos. 
          El score indica la relevancia del fragmento con respecto a tu pregunta.
        </p>
      </div>
    </div>
  );
};