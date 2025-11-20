// src/components/chat/ResponseModeToggle.tsx
// Toggle para cambiar entre modo breve y extendido

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, AlignLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  setResponseMode,
  selectResponseMode,
} from '../../store/slices/chatSlice';
import type { AppDispatch } from '../../store';

export const ResponseModeToggle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentMode = useSelector(selectResponseMode);

  const isBrief = currentMode === 'breve';

  const handleToggle = () => {
    const newMode = isBrief ? 'extendido' : 'breve';
    dispatch(setResponseMode(newMode));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 hidden sm:inline">
        Modo de respuesta:
      </span>
      
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {/* Botón Breve */}
        <Button
          variant={isBrief ? 'default' : 'ghost'}
          size="sm"
          onClick={handleToggle}
          className={`
            relative px-3 py-1 text-xs font-medium transition-all
            ${isBrief
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          disabled={isBrief}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Breve
        </Button>

        {/* Botón Extendido */}
        <Button
          variant={!isBrief ? 'default' : 'ghost'}
          size="sm"
          onClick={handleToggle}
          className={`
            relative px-3 py-1 text-xs font-medium transition-all
            ${!isBrief
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          disabled={!isBrief}
        >
          <AlignLeft className="w-3 h-3 mr-1" />
          Extendido
        </Button>
      </div>

      {/* Info tooltip */}
      <div className="hidden lg:block group relative">
        <Badge
          variant="outline"
          className="cursor-help text-xs border-gray-300 text-gray-600"
        >
          ?
        </Badge>
        
        {/* Tooltip */}
        <div className="
          invisible group-hover:visible
          absolute right-0 top-full mt-2 z-50
          w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg
        ">
          <p className="font-medium mb-1">Modos de respuesta:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <span className="font-medium">Breve:</span> 2-3 frases concisas
            </li>
            <li>
              <span className="font-medium">Extendido:</span> Explicación detallada con citas completas
            </li>
          </ul>
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      </div>
    </div>
  );
};