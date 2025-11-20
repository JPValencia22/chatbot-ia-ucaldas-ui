// src/components/chat/SourcesPanel.tsx
// Panel lateral colapsable con fuentes consultadas

import React from 'react';
import { X, ChevronLeft, ChevronRight, FileText, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import type { SourcesPanelProps } from '../../types/chat.types';

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  sources,
  isOpen,
  onToggle,
}) => {
  /**
   * Calcular promedio de scores
   */
  const avgScore = sources.length > 0
    ? sources.reduce((sum, s) => sum + s.score, 0) / sources.length
    : 0;

  /**
   * Agrupar fuentes por documento
   */
  const sourcesByDocument = sources.reduce((acc, source) => {
    if (!acc[source.doc_nombre]) {
      acc[source.doc_nombre] = [];
    }
    acc[source.doc_nombre].push(source);
    return acc;
  }, {} as Record<string, typeof sources>);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-40"
          onClick={onToggle}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed lg:relative right-0 top-0 h-full
          bg-white border-l border-gray-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-96' : 'w-0 lg:w-16'}
          overflow-hidden
        `}
      >
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={`
            absolute top-4 -left-10 lg:-left-12
            bg-white border border-gray-200 shadow-md
            rounded-l-lg rounded-r-none
            hover:bg-gray-50
            z-10
          `}
        >
          {isOpen ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>

        {/* Contenido del panel cuando está abierto */}
        {isOpen && (
          <div className="h-full flex flex-col p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Fuentes Consultadas
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Documentos recuperados de la base de conocimientos
              </p>
            </div>

            {/* Estadísticas */}
            {sources.length > 0 && (
              <>
                <Card className="p-4 mb-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Estadísticas
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Chunks</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {sources.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Score Promedio</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {(avgScore * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Documentos</p>
                      <p className="text-sm font-medium text-gray-900">
                        {Object.keys(sourcesByDocument).length} diferentes
                      </p>
                    </div>
                  </div>
                </Card>

                <Separator className="my-4" />
              </>
            )}

            {/* Lista de fuentes */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {sources.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No hay fuentes para mostrar
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Envía una pregunta para ver las fuentes consultadas
                  </p>
                </div>
              ) : (
                Object.entries(sourcesByDocument).map(([docName, docSources]) => (
                  <Card key={docName} className="p-3 hover:shadow-md transition-shadow">
                    {/* Nombre del documento */}
                    <div className="flex items-start gap-2 mb-3">
                      <FileText className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {docName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {docSources.length} chunk{docSources.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Chunks de este documento */}
                    <div className="space-y-2 pl-6">
                      {docSources
                        .sort((a, b) => b.score - a.score)
                        .map((source) => (
                          <div
                            key={source.chunk_index}
                            className="bg-gray-50 rounded p-2 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                Chunk #{source.chunk_index}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {(source.score * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {source.chunk_text}
                            </p>
                          </div>
                        ))}
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Footer con info */}
            {sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Los scores indican la relevancia de cada fragmento con respecto a la consulta realizada
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vista colapsada (solo icono) */}
        {!isOpen && (
          <div className="hidden lg:flex flex-col items-center py-6 space-y-4">
            <FileText className="w-6 h-6 text-gray-400" />
            {sources.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {sources.length}
              </Badge>
            )}
          </div>
        )}
      </div>
    </>
  );
};