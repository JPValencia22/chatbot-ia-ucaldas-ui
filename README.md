# Frontend - ChatBot IA Universidad de Caldas 🤖

---

## **Descripción del Proyecto**

Frontend web interactivo para el ChatBot de Inteligencia Artificial desarrollado como Proyecto 1 de Sistemas Inteligentes I. Este frontend se conecta con workflows de N8N que implementan arquitectura RAG (Retrieval-Augmented Generation) para proporcionar respuestas confiables sobre IA con citas verificables.

### **Características Principales**

- 💬 Interfaz de chat conversacional moderna
- 📚 Visualización de respuestas con citas verificables
- 🔍 Indicador de fuentes utilizadas (top-5 chunks de Pinecone)
- 🎨 Diseño responsivo y accesible
- ⚡ Conexión en tiempo real con N8N workflows
- 📊 Modo breve y extendido de respuestas
- 🔄 Historial de conversación

---

## **Estructura del Proyecto**

```plaintext
frontend/
├── .env                      # Variables de entorno (N8N webhook URLs)
├── .gitignore                # Archivos ignorados por Git
├── components.json           # Configuración de componentes (ShadCN)
├── eslint.config.js          # Configuración de ESLint
├── index.html                # HTML principal del proyecto
├── package-lock.json         # Archivo de bloqueo de dependencias
├── package.json              # Dependencias y scripts
├── postcss.config.js         # Configuración de PostCSS
├── README.md                 # Documentación del frontend
├── tailwind.config.js        # Configuración de Tailwind CSS
├── tsconfig.app.json         # Configuración de TypeScript para la aplicación
├── tsconfig.json             # Configuración base de TypeScript
├── tsconfig.node.json        # Configuración de TypeScript para Node
├── vite.config.ts            # Configuración de Vite
│
├── public/                   # Archivos estáticos
│   ├── chatbot-avatar.png    # Avatar del ChatBot
│   ├── user-avatar.png       # Avatar del usuario
│   └── ucaldas-logo.png      # Logo de la Universidad de Caldas
│
├── src/                      # Código fuente del proyecto
    ├── App.tsx               # Punto de entrada principal de React
    ├── main.tsx              # Renderización de la aplicación
    ├── vite-env.d.ts         # Tipos de entorno para Vite
    │
    ├── api/                  # Lógica para llamadas HTTP
    │   ├── axiosConfig.ts    # Configuración global de Axios
    │   └── chatApi.ts        # Funciones para interactuar con N8N
    │
    ├── assets/               # Recursos adicionales
    │
    ├── components/           # Componentes reutilizables
    │   ├── chat/             # Componentes del chat
    │   │   ├── ChatBox.tsx           # Componente principal del chat
    │   │   ├── MessageBubble.tsx     # Burbujas de mensaje
    │   │   ├── CitationDisplay.tsx   # Visualización de citas
    │   │   ├── SourcesPanel.tsx      # Panel lateral con fuentes
    │   │   ├── ResponseModeToggle.tsx # Toggle modo breve/extendido
    │   │   └── WelcomeScreen.tsx     # Pantalla de bienvenida
    │   │
    │   └── ui/               # Componentes estilizados con ShadCN/UI
    │       ├── button.tsx    # Botón reutilizable
    │       ├── card.tsx      # Tarjetas para visualización
    │       ├── input.tsx     # Inputs estilizados
    │       ├── badge.tsx     # Badges para tags
    │       ├── separator.tsx # Separadores visuales
    │       └── skeleton.tsx  # Componentes de carga
    │
    ├── lib/                  # Utilidades globales
    │   └── utils.ts          # Funciones auxiliares
    │
    ├── store/                # Configuración de Redux
    │   ├── index.ts          # Configuración del store global
    │   └── slices/           # Slices de Redux
    │       ├── chatSlice.ts      # Lógica para gestionar chat
    │       └── settingsSlice.ts  # Lógica para configuración
    │
    ├── styles/               # Estilos globales
    │   └── globals.css       # Configuración de Tailwind CSS
    │
    ├── types/                # Definiciones de tipos TypeScript
    │   ├── chat.types.ts     # Tipos para mensajes y respuestas
    │   └── n8n.types.ts      # Tipos para respuestas de N8N
    │
    └── utils/                # Utilidades para la aplicación
        ├── api.ts            # Configuración adicional de Axios
        └── formatting.ts     # Funciones de formateo de texto
```

---

## **Instalación**

### **Requisitos previos**

- **Node.js 18 o superior**
- **NPM** o **Yarn** instalado
- **Acceso a N8N** con workflow `02_Consulta_RAG.json` desplegado
- **Webhook URL** del workflow de consulta

### **Pasos para configurar**

1. Clona el repositorio:

   ```bash
   git clone https://github.com/JPValencia22/chatbot-ia-ucaldas-ui.git
   cd chatbot-ia-ucaldas-ui/frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno en el archivo `.env`:

   ```plaintext
   # URL del webhook de N8N para consultas RAG
   VITE_N8N_WEBHOOK_URL=https://tu-instancia-n8n.app.n8n.cloud/webhook/consulta-rag
   
   # URL del webhook de N8N para evaluación (opcional)
   VITE_N8N_EVAL_WEBHOOK_URL=https://tu-instancia-n8n.app.n8n.cloud/webhook/evaluacion
   
   # Configuración de la aplicación
   VITE_APP_NAME="ChatBot IA - Universidad de Caldas"
   VITE_APP_VERSION="1.0.0"
   ```

4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Abre el navegador en `http://localhost:5173`

---

## **Características Implementadas**

### **1. Interfaz de Chat Conversacional**

- **Componente principal:** `ChatBox.tsx`
- **Descripción:** Interfaz moderna de chat con burbujas de mensaje diferenciadas para usuario y ChatBot
- **Características:**
  - Auto-scroll al último mensaje
  - Indicador de escritura ("typing...")
  - Timestamps en cada mensaje
  - Detección de mensajes con/sin citas

### **2. Visualización de Citas Verificables**

- **Componente:** `CitationDisplay.tsx`
- **Descripción:** Muestra las citas extraídas del corpus en formato estructurado
- **Formato de cita:**
  ```
  [Fuente: nombre_documento.pdf | Chunk: 42]
  "Fragmento de texto relevante del documento..."
  ```

### **3. Panel de Fuentes Consultadas**

- **Componente:** `SourcesPanel.tsx`
- **Descripción:** Panel lateral colapsable que muestra los top-5 chunks recuperados de Pinecone
- **Información mostrada:**
  - Nombre del documento fuente
  - ID del chunk
  - Score de similitud (0.00 - 1.00)
  - Vista previa del contenido

### **4. Modo de Respuesta (Breve/Extendido)**

- **Componente:** `ResponseModeToggle.tsx`
- **Descripción:** Toggle para alternar entre respuestas breves (2-3 frases) y extendidas (detalladas con citas)
- **Implementación:** Envía parámetro `mode` al webhook de N8N

### **5. Pantalla de Bienvenida**

- **Componente:** `WelcomeScreen.tsx`
- **Descripción:** Mensaje inicial con ejemplos de preguntas
- **Categorías de ejemplo:**
  - Conceptos básicos de IA
  - Historia de la IA
  - Machine Learning clásico
  - Deep Learning y LLMs
  - Ética y regulación
  - Aplicaciones prácticas

### **6. Gestión de Estado con Redux**

- **Store:** `store/index.ts`
- **Slices:**
  - `chatSlice.ts`: Gestiona mensajes, estado de carga, errores
  - `settingsSlice.ts`: Gestiona preferencias de usuario (modo respuesta, tema)

---

## **Conexión con N8N**

### **Estructura de Request al Webhook**

El frontend envía requests POST al webhook de N8N con el siguiente formato:

```typescript
{
  "pregunta": "¿Qué es la Inteligencia Artificial?",
  "modo": "extendido", // "breve" | "extendido"
  "historial": [
    {
      "rol": "user",
      "contenido": "Pregunta anterior..."
    },
    {
      "rol": "assistant",
      "contenido": "Respuesta anterior..."
    }
  ]
}
```

### **Estructura de Response desde N8N**

El webhook de N8N debe responder con el siguiente formato:

```typescript
{
  "respuesta": "Texto de la respuesta con citas incluidas [Fuente: documento.pdf | Chunk: 42]",
  "fuentes": [
    {
      "doc_nombre": "UNESCO_IA_2023.pdf",
      "doc_index": 1,
      "chunk_index": 42,
      "chunk_text": "Fragmento del documento...",
      "score": 0.89
    },
    // ... hasta 5 fuentes
  ],
  "metadata": {
    "num_chunks_recuperados": 5,
    "modelo_usado": "gpt-3.5-turbo",
    "tokens_consumidos": 450,
    "latencia_ms": 1200
  }
}
```

### **Manejo de Errores**

El frontend maneja los siguientes casos:

1. **Error de conexión:** Mensaje: "No se pudo conectar con el servidor. Verifica tu conexión."
2. **Timeout (>30s):** Mensaje: "La consulta tomó demasiado tiempo. Intenta con una pregunta más específica."
3. **Sin información:** Cuando N8N responde con `no_tiene_informacion: true`, el frontend muestra: "Lo siento, no tengo información suficiente sobre ese tema en mi base de conocimientos."
4. **Error del servidor:** Mensaje genérico con opción de reintentar

---

## **Flujo de Uso**

### **Flujo Principal: Consulta Simple**

```
1. Usuario escribe pregunta en el input
   ↓
2. Frontend valida input (no vacío, <500 caracteres)
   ↓
3. Se muestra mensaje del usuario en el chat
   ↓
4. Se envía request POST al webhook de N8N
   ↓
5. Se muestra indicador de "escribiendo..."
   ↓
6. N8N procesa con workflow 02_Consulta_RAG.json:
   - Genera embedding de la pregunta
   - Busca en Pinecone (top-5 chunks)
   - Construye prompt con contexto
   - Genera respuesta con GPT-3.5-turbo
   ↓
7. Frontend recibe respuesta
   ↓
8. Se parsean citas del formato [Fuente: ... | Chunk: ...]
   ↓
9. Se muestra respuesta en burbuja del ChatBot
   ↓
10. Se actualiza panel de fuentes con chunks recuperados
```

### **Flujo Alternativo: Cambio de Modo**

```
1. Usuario hace clic en toggle "Modo Extendido"
   ↓
2. Se actualiza estado en Redux (settingsSlice)
   ↓
3. Próximas consultas incluyen modo="extendido" en request
   ↓
4. N8N ajusta parámetros del prompt para respuesta detallada
```

---

## **Desarrollo**

### **Comandos Disponibles**

```bash
# Modo desarrollo con hot-reload
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint

# Formateo de código (si se configura Prettier)
npm run format
```

### **Agregar Nuevo Componente**

1. Crear archivo en `src/components/chat/` o `src/components/ui/`
2. Definir tipos en `src/types/` si es necesario
3. Importar y usar en `ChatBox.tsx` o donde corresponda

**Ejemplo:**

```typescript
// src/components/chat/FeedbackButton.tsx
import { Button } from "@/components/ui/button";

interface FeedbackButtonProps {
  messageId: string;
  onFeedback: (messageId: string, rating: "positive" | "negative") => void;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  messageId,
  onFeedback,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFeedback(messageId, "positive")}
      >
        👍
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFeedback(messageId, "negative")}
      >
        👎
      </Button>
    </div>
  );
};
```

### **Agregar Lógica para Nuevas Funciones**

1. Crear slice en `store/slices/`
2. Conectar al store en `store/index.ts`
3. Usar hooks en componentes: `useSelector`, `useDispatch`

---

## **Pruebas**

### **Pruebas Funcionales**

1. **Chat básico:**
   ```bash
   # Verificar que se puede enviar un mensaje
   # Verificar que aparece la respuesta del ChatBot
   # Verificar que se muestran las citas
   ```

2. **Panel de fuentes:**
   ```bash
   # Verificar que se muestran los 5 chunks recuperados
   # Verificar que se muestra el score de similitud
   # Verificar que el panel es colapsable
   ```

3. **Modo breve/extendido:**
   ```bash
   # Enviar pregunta en modo breve
   # Cambiar a modo extendido
   # Enviar la misma pregunta
   # Verificar diferencia en longitud de respuesta
   ```

### **Pruebas de Integración con N8N**

1. Verificar conectividad:
   ```bash
   curl -X POST https://tu-webhook-url.n8n.cloud/webhook/consulta-rag \
     -H "Content-Type: application/json" \
     -d '{"pregunta":"¿Qué es IA?","modo":"breve"}'
   ```

2. Verificar formato de respuesta
3. Verificar manejo de errores (webhook offline, timeout)

---

## **Despliegue**

### **Opción 1: Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# O desde Git:
# 1. Conectar repositorio a Vercel
# 2. Configurar variables de entorno en Vercel Dashboard
# 3. Deploy automático en cada push a main
```

### **Opción 2: Netlify**

```bash
# Build
npm run build

# Desplegar carpeta dist/
netlify deploy --prod --dir=dist
```

### **Opción 3: GitHub Pages (Solo para pruebas)**

```bash
# Configurar base en vite.config.ts
base: '/chatbot-ia-ucaldas/'

# Build
npm run build

# Desplegar a gh-pages branch
npm run deploy
```

---

## **Variables de Entorno en Producción**

Asegúrate de configurar en tu plataforma de deployment:

```plaintext
VITE_N8N_WEBHOOK_URL=https://produccion.n8n.cloud/webhook/consulta-rag
VITE_APP_NAME="ChatBot IA - UdeCaldas"
VITE_APP_VERSION="1.0.0"
```

---

## **Consideraciones de Seguridad**

### **CORS en N8N**

Asegúrate de configurar correctamente CORS en el webhook de N8N:

```json
{
  "headers": {
    "Access-Control-Allow-Origin": "https://tu-frontend-url.vercel.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  }
}
```

### **Validación de Input**

- Máximo 500 caracteres por mensaje
- Sanitización de HTML para prevenir XSS
- Rate limiting: máximo 10 consultas por minuto

### **No Almacenamiento de PII**

- No se almacenan conversaciones en localStorage por defecto
- Si se habilita historial local, debe ser opt-in explícito del usuario

---

## **Métricas de Rendimiento**

### **Objetivos de Performance**

- **Tiempo de respuesta:** <3 segundos (promedio)
- **First Contentful Paint:** <1.5 segundos
- **Time to Interactive:** <2.5 segundos
- **Tamaño del bundle:** <500 KB (gzipped)

### **Optimizaciones Implementadas**

- Code splitting por rutas
- Lazy loading de componentes pesados
- Compresión de imágenes en WebP
- Tree shaking automático con Vite

---

## **Troubleshooting**

### **Problema: No se conecta con N8N**

**Solución:**
1. Verificar que `VITE_N8N_WEBHOOK_URL` esté correcta en `.env`
2. Verificar que el workflow `02_Consulta_RAG.json` esté activo en N8N
3. Probar webhook con cURL primero
4. Verificar configuración de CORS en N8N

### **Problema: Las citas no se muestran**

**Solución:**
1. Verificar formato de respuesta de N8N
2. Asegurarse de que el array `fuentes` esté presente
3. Verificar regex de parseo de citas en `CitationDisplay.tsx`

### **Problema: Respuestas muy lentas**

**Solución:**
1. Verificar latencia del workflow en N8N
2. Considerar reducir `top_k` de 5 a 3 chunks
3. Verificar cold start de Pinecone (primera consulta del día)

---

## **Roadmap Futuro**

### **Versión 1.1 (Post-entrega)**
- [ ] Sistema de feedback (👍👎) por respuesta
- [ ] Exportar conversación como PDF
- [ ] Compartir respuesta específica (link corto)
- [ ] Estadísticas de uso (dashboard para admin)

### **Versión 1.2**
- [ ] Soporte para modo oscuro
- [ ] Búsqueda en historial de conversaciones
- [ ] Sugerencias automáticas mientras se escribe
- [ ] Integración con WhatsApp Web API

### **Versión 2.0 (Opcional - Proyecto futuro)**
- [ ] Autenticación de usuarios (Google, Microsoft)
- [ ] Perfiles personalizados por rol (estudiante, profesor, investigador)
- [ ] Conversaciones guardadas en la nube
- [ ] Sistema de recomendaciones de documentos

---

## **Contribuciones**

Este proyecto es desarrollado como trabajo académico por:

- **Jerónimo Toro C** (20712) - Infraestructura, MLOps, LLM y Evaluación
- **Juan Pablo Valencia C** (29169) - Contexto, Aplicación, RAG e Interfaz

Para contribuciones, seguir el flujo de GitHub:

1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Abrir Pull Request

---

## **Licencia**

Este proyecto es desarrollado con fines académicos para la Universidad de Caldas.

---

## **Contacto**

- **Repositorio:** https://github.com/JeronimoToroC/chatbot-ia-ucaldas
- **Estudiante principal:** Jerónimo Toro C (jeronimo.toro.c@gmail.com)
- **Compañero:** Juan Pablo Valencia C
- **Profesor:** Luis Fernando Castillo Ossa
- **Curso:** Sistemas Inteligentes I - Universidad de Caldas

---

## **Referencias**

- [Documentación de N8N](https://docs.n8n.io/)
- [Pinecone Vector Database](https://docs.pinecone.io/)
- [OpenAI API Reference](https://platform.openai.com/docs/)
- [React + TypeScript](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN/UI Components](https://ui.shadcn.com/)
- [Vite Documentation](https://vitejs.dev/)

---

_Última actualización: 20 de noviembre de 2025_