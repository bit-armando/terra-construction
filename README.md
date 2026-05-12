# Integraciones Templer — Sitio Web Inmobiliario

Sitio web moderno para constructora mexicana, construido con Next.js 14 + Tailwind CSS + shadcn/ui.

## Características

- **Catálogo de modelos** con filtros inteligentes (precio, recámaras, ubicación, estado)
- **Página de detalle** por modelo con galería, calculadora hipotecaria y mapa
- **Desarrollos/fraccionamientos** con amenidades y avance de obra
- **WhatsApp integrado** con mensajes pre-llenados contextuales
- **Calculadora hipotecaria** (INFONAVIT, FOVISSSTE, bancario, cofinavit)
- **Favoritos** guardados en localStorage sin registro
- **Diseño responsive** mobile-first con animaciones sutiles (Framer Motion)
- **SEO optimizado** con metadatos y Schema.org listo para implementar

## Stack Técnico

| Tecnología | Uso |
|------------|-----|
| Next.js 14 | Framework React con App Router |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos utilitarios |
| shadcn/ui | Componentes base (Button, Card, Accordion, Select, etc.) |
| Framer Motion | Animaciones de entrada y transiciones |
| Lucide React | Iconografía |

## Estructura de Carpetas

```
src/
├── app/                    # Rutas de Next.js (App Router)
│   ├── modelos/[slug]/     # Página de detalle de modelo
│   ├── desarrollos/        # Página de desarrollos
│   ├── privacidad/         # Aviso de privacidad
│   ├── terminos/           # Términos y condiciones
│   ├── layout.tsx          # Layout global con Header/Footer/WhatsApp
│   └── page.tsx            # Página principal
├── components/
│   ├── sections/           # Secciones de la página principal
│   │   ├── Hero.tsx
│   │   ├── ModelCatalog.tsx
│   │   ├── Developments.tsx
│   │   ├── ProcessTimeline.tsx
│   │   ├── Testimonials.tsx
│   │   ├── About.tsx
│   │   └── FAQ.tsx
│   ├── shared/             # Componentes reutilizables
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatsAppFloat.tsx
│   │   ├── ModelCard.tsx
│   │   ├── ModelFilters.tsx
│   │   └── MortgageCalculator.tsx
│   └── ui/                 # Componentes shadcn/ui
├── data/                   # Datos mock en JSON/TS
│   ├── models.ts           # Modelos de casas
│   ├── developments.ts     # Desarrollos
│   ├── testimonials.ts     # Testimonios
│   ├── faq.ts              # Preguntas frecuentes
│   └── team.ts             # Equipo de asesores
├── hooks/
│   └── useWhatsApp.ts      # Hook para generar links de WhatsApp
├── lib/
│   ├── types.ts            # Tipos de TypeScript
│   └── utils.ts            # Utilidades (cn, etc.)
```

## Datos Mock

Todos los datos del sitio se encuentran en `src/data/` como archivos TypeScript exportando arrays de objetos tipados:

- **models.ts**: 6 modelos de casas con imágenes de Unsplash, precios, specs, features
- **developments.ts**: 2 desarrollos con amenidades y avance de obra
- **testimonials.ts**: 5 testimonios de clientes
- **faq.ts**: 8 preguntas frecuentes por categoría
- **team.ts**: 4 asesores con foto y número de WhatsApp

## Configuración de WhatsApp

Edita el número de teléfono en `src/hooks/useWhatsApp.ts`:

```typescript
const PHONE_NUMBER = "5214421234567"; // Reemplaza con tu número
```

Los mensajes pre-llenados se generan automáticamente según el contexto (modelo, desarrollo, etc.).

## Instrucciones de Despliegue

### Opción 1: Vercel (Recomendado)

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Selecciona el proyecto `my-app`
4. Vercel detectará automáticamente Next.js y configurará el build
5. Cada push a `main` desplegará automáticamente

```bash
# Instala Vercel CLI (opcional)
npm i -g vercel

# Despliega manualmente
vercel
```

### Opción 2: Netlify

1. Crea una cuenta en [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto o conecta tu repo
3. Configura el build command: `npm run build`
4. Directorio de publicación: `out` (si usas `output: 'export'` en next.config.mjs)

### Opción 3: Export Estático

Para generar un sitio estático puro (sin SSR):

```javascript
// next.config.mjs
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Requerido para export estático
  },
};
```

```bash
cd my-app
npm run build
# Los archivos estáticos se generan en la carpeta `out/`
```

## Desarrollo Local

```bash
cd my-app
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Actualizar Contenido sin Código

Para que el cliente pueda actualizar modelos, desarrollos y contenido sin tocar código, se recomienda integrar un **CMS Headless**:

### Opción recomendada: Sanity

1. Crea un proyecto en [sanity.io](https://sanity.io)
2. Define los schemas para Modelo, Desarrollo, Testimonio, FAQ, etc.
3. Instala el cliente de Sanity en el proyecto:

```bash
npm install @sanity/client
```

4. Crea un archivo `src/lib/sanity.ts`:

```typescript
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'TU_PROJECT_ID',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

5. Reemplaza las importaciones de datos estáticos por fetchs de Sanity en las páginas.

### Alternativa: Strapi

- Self-hosted o cloud
- Panel de administración visual
- API REST y GraphQL automáticas

### Alternativa simple: Google Sheets + API

Para un enfoque más económico, puedes usar Google Sheets como base de datos y consumirla mediante una API intermedia (como SheetDB o una función serverless).

## Personalización

### Paleta de Colores

Edita `tailwind.config.ts` en la sección `colors.brand` para cambiar los tonos de la marca.

### Tipografía

Edita `src/app/layout.tsx` para cambiar las fuentes. Por defecto usa Inter (sans-serif) y Playfair Display (serif para títulos).

### Imágenes

Las imágenes actuales usan Unsplash como placeholder. Reemplaza las URLs en los archivos de `src/data/` con las fotos reales del cliente. Se recomienda usar un servicio de CDN como Cloudinary o AWS S3 para optimización automática.

## Licencia

Proyecto privado para Integraciones Templer.
