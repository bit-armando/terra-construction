# Terra Construction — Guía para Agentes de Código

> Este archivo contiene el contexto esencial que todo agente de código necesita para trabajar en este proyecto. Léelo antes de hacer cualquier cambio.

---

## Resumen del Proyecto

**Terra Construction** es un sitio web inmobiliario para una constructora mexicana. Presenta un catálogo de modelos de casas, desarrollos (fraccionamientos), calculadora hipotecaria, integración con WhatsApp y un panel de administración básico. El sitio está orientado al mercado de Querétaro y San Juan del Río, México.

- **Idioma del sitio**: Español (es-MX)
- **Moneda**: Pesos mexicanos (MXN)
- **Imágenes actuales**: Placeholders de Unsplash
- **Datos**: Mix de archivos estáticos en TypeScript (`src/data/`) con soporte opcional para base de datos Turso (SQLite)

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 14.2.35 | Framework React con App Router |
| React | 18 | UI library |
| TypeScript | 5 | Tipado estático (strict mode) |
| Tailwind CSS | 3.4.1 | Estilos utilitarios |
| shadcn/ui | — | Componentes base (Button, Card, Dialog, etc.) usando `@base-ui/react` estilo `base-nova` |
| Framer Motion | 12.x | Animaciones de entrada y transiciones |
| Lucide React | 1.x | Iconografía |
| Embla Carousel | 8.x | Carruseles |
| @libsql/client | 0.17.x | Cliente para base de datos Turso (SQLite) |
| jsonwebtoken | 9.x | Autenticación JWT para admin |
| bcryptjs | 3.x | Hash de contraseñas |

---

## Estructura de Carpetas

```
src/
├── app/                          # Rutas de Next.js (App Router)
│   ├── api/
│   │   ├── auth/route.ts         # Login/logout admin (JWT en cookie)
│   │   ├── auth/me/route.ts      # Ping de autenticación
│   │   ├── developments/route.ts # CRUD de desarrollos
│   │   ├── developments/[id]/route.ts # PUT/DELETE por ID
│   │   ├── models/route.ts       # CRUD de modelos de casas
│   │   ├── models/[id]/route.ts  # Operaciones por ID
│   │   ├── seed/route.ts         # Endpoint para poblar la BD
│   │   └── settings/route.ts     # Configuración global editable
│   ├── admin/
│   │   ├── page.tsx              # Dashboard del panel admin
│   │   ├── login/page.tsx        # Login de administrador
│   │   ├── modelos/page.tsx      # CRUD de modelos
│   │   ├── desarrollos/page.tsx  # CRUD de desarrollos
│   │   ├── configuracion/page.tsx # Edición de settings
│   │   ├── exportar/page.tsx     # Exportar/importar JSON
│   │   └── layout.tsx            # Layout con sidebar de admin
│   ├── desarrollos/page.tsx      # Página de desarrollos
│   ├── modelos/[slug]/page.tsx   # Página de detalle de modelo
│   ├── privacidad/page.tsx       # Aviso de privacidad
│   ├── terminos/page.tsx         # Términos y condiciones
│   ├── layout.tsx                # Layout global (Header, Footer, WhatsAppFloat)
│   ├── page.tsx                  # Home con secciones
│   └── globals.css               # Variables CSS, Tailwind directives, tema
├── components/
│   ├── sections/                 # Secciones de la página principal
│   │   ├── About.tsx
│   │   ├── Developments.tsx
│   │   ├── FAQ.tsx
│   │   ├── Hero.tsx
│   │   ├── ModelCatalog.tsx
│   │   ├── ProcessTimeline.tsx
│   │   └── Testimonials.tsx
│   ├── shared/                   # Componentes reutilizables
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ModelCard.tsx
│   │   ├── ModelFilters.tsx
│   │   ├── MortgageCalculator.tsx
│   │   ├── SafeImage.tsx
│   │   └── WhatsAppFloat.tsx
│   └── admin/                    # Componentes del panel admin
│       ├── AdminSidebar.tsx
│       └── ConfirmDialog.tsx
│   └── ui/                       # Componentes de shadcn/ui
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── tabs.tsx
├── data/                         # Datos mock tipados
│   ├── developments.ts
│   ├── faq.ts
│   ├── models.ts
│   ├── team.ts
│   └── testimonials.ts
├── hooks/
│   ├── useAdminAuth.ts           # Verifica autenticación de admin
│   └── useWhatsApp.ts            # Genera links de WhatsApp con mensaje contextual
├── lib/
│   ├── auth.ts                   # Verificación JWT y helpers de auth
│   ├── db/
│   │   ├── client.ts             # Cliente Turso/libsql con fallback a mock
│   │   ├── schema.sql            # Esquema completo de la base de datos
│   │   └── seed.ts               # Pobla la BD desde los archivos de `src/data/`
│   ├── types.ts                  # Interfaces TypeScript del dominio
│   └── utils.ts                  # Utilidades (`cn` para clases de Tailwind)
```

---

## Comandos de Build y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (localhost:3000)
npm run dev

# Build de producción
npm run build

# Iniciar en producción (requiere build previo)
npm run start

# Linter (ESLint con next/core-web-vitals y next/typescript)
npm run lint
```

**Nota**: No hay scripts de test configurados. El proyecto no tiene suite de pruebas unitarias ni de integración.

---

## Variables de Entorno

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```bash
# Base de datos (opcional — si no se configura, usa datos mock)
TURSO_DATABASE_URL=libsql://...turso.io
TURSO_AUTH_TOKEN=turso-token-...

# Seguridad admin (CAMBIAR EN PRODUCCIÓN)
ADMIN_PASSWORD=admin123
JWT_SECRET=terra-secret-key-change-in-production
```

**Advertencia**: El código contiene valores por defecto para `ADMIN_PASSWORD` y `JWT_SECRET`. En producción deben definirse como variables de entorno seguras.

---

## Arquitectura de Datos

### Modo Mock (por defecto)

Si no se configura `TURSO_DATABASE_URL`, todas las API routes devuelven los datos estáticos de `src/data/*.ts`. Esto permite ejecutar el sitio sin base de datos.

### Modo Base de Datos (Turso/SQLite)

Si se configura Turso, las API routes leen y escriben en la base de datos. El esquema está en `src/lib/db/schema.sql` y define las tablas:

- `settings` — Configuración global (teléfono, dirección, horarios, meta tags)
- `models` — Modelos de casas
- `developments` — Desarrollos/fraccionamientos
- `testimonials` — Testimonios de clientes
- `faqs` — Preguntas frecuentes
- `team_members` — Equipo de asesores

Los campos JSON (imágenes, amenidades, features, etc.) se almacenan como texto JSON en columnas con sufijo `_json`.

### Seed

El endpoint `POST /api/seed` (protegido por autenticación admin) ejecuta `seedDatabase()` para poblar la BD con los datos de los archivos estáticos.

---

## API Routes

Todas las rutas de API están en `src/app/api/` y usan los Route Handlers de Next.js App Router.

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/models` | Lista todos los modelos | No |
| POST | `/api/models` | Crea un nuevo modelo | Admin |
| GET | `/api/models/[id]` | Obtiene un modelo por ID | No |
| PUT | `/api/models/[id]` | Actualiza un modelo | Admin |
| DELETE | `/api/models/[id]` | Elimina un modelo | Admin |
| GET | `/api/developments` | Lista desarrollos | No |
| POST | `/api/developments` | Crea un desarrollo | Admin |
| GET | `/api/settings` | Obtiene configuración | No |
| POST | `/api/settings` | Actualiza configuración | Admin |
| POST | `/api/auth` | Login admin (devuelve JWT cookie) | No |
| DELETE | `/api/auth` | Logout admin (borra cookie) | No |
| GET | `/api/auth/me` | Verifica autenticación | Admin |
| PUT | `/api/developments/[id]` | Actualiza desarrollo | Admin |
| DELETE | `/api/developments/[id]` | Elimina desarrollo | Admin |
| POST | `/api/seed` | Puebla la BD con datos iniciales | Admin |

Las respuestas de error de autenticación devuelven `{ error: "No autorizado" }` con status 401.

---

## Autenticación de Administrador

- El login se hace vía `POST /api/auth` enviando `{ password }`.
- Si la contraseña coincide con `ADMIN_PASSWORD`, se genera un JWT con `jsonwebtoken`.
- El token se guarda en una cookie `admin_token` (`httpOnly`, `secure` en producción, `sameSite: strict`, path `/`, 7 días).
- Las rutas protegidas usan `verifyAdminToken(request)` de `src/lib/auth.ts`.
- El hook `useAdminAuth` en el cliente hace una petición a `/api/auth/me` para verificar autenticación.

---

## Convenciones de Código

### TypeScript
- `strict: true` habilitado en `tsconfig.json`.
- Usa las interfaces definidas en `src/lib/types.ts` para todo el dominio.
- Los tipos de filas de base de datos se mapean manualmente de `Record<string, unknown>` a las interfaces del dominio.

### Componentes
- Los componentes de UI usan **shadcn/ui** con estilo `base-nova` (basado en `@base-ui/react`).
- La función `cn()` de `src/lib/utils.ts` se usa para combinar clases de Tailwind de forma segura.
- Los componentes que usan hooks de React o APIs del navegador deben llevar `"use client";` al inicio.
- Los componentes de sección van en `src/components/sections/`.
- Los componentes reutilizables van en `src/components/shared/`.
- Los componentes de shadcn/ui van en `src/components/ui/`.

### Estilos
- Todo el estilado se hace con **Tailwind CSS**.
- El tema usa variables CSS definidas en `src/app/globals.css`.
- Colores de marca definidos en `tailwind.config.ts` bajo `colors.brand` (tonos de 50 a 950).
- Color de WhatsApp definido como `colors.whatsapp.DEFAULT` y `colors.whatsapp.dark`.
- Fuente sans: Inter. Fuente serif: Playfair Display.

### Patrones comunes
- Las imágenes usan el componente `SafeImage` (wrapper sobre `next/image` con manejo de errores).
- Las imágenes remotas permitidas: solo `images.unsplash.com`.
- Los precios se formatean con `Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })`.
- Los mensajes de WhatsApp se generan contextualmente según el modelo o desarrollo seleccionado.
- Las animaciones de entrada usan `framer-motion` con `initial={{ opacity: 0, y: 20 }}`.

### Nomenclatura
- Archivos de componentes: PascalCase (ej. `ModelCard.tsx`).
- Archivos de utilidades/hooks: camelCase (ej. `useWhatsApp.ts`).
- Interfaces: PascalCase (ej. `HouseModel`, `Development`).
- Slugs de modelos: kebab-case con prefijo `modelo-` (ej. `modelo-aurora`).
- Slugs de desarrollos: kebab-case (ej. `bosques-del-refugio`).

---

## Instrucciones de Despliegue

### Next.js tradicional (Vercel, servidor Node)

```bash
npm run build
npm run start
```

### Export estático (Netlify, CDN, hosting estático)

Descomenta la línea `output: 'export'` en `next.config.mjs`. Las imágenes ya están configuradas como `unoptimized: true` para compatibilidad con export estático.

```bash
npm run build
# Genera archivos estáticos en la carpeta out/
```

**Nota**: El export estático NO soporta API routes ni SSR. El sitio funcionará solo con los datos estáticos de `src/data/`.

### Requisitos de runtime
- Node.js 18+
- Si se usa base de datos: configurar `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`

---

## Consideraciones de Seguridad

1. **Contraseña admin por defecto**: `ADMIN_PASSWORD` tiene fallback a `"admin123"`. Siempre definir en variables de entorno en producción.
2. **JWT Secret por defecto**: `JWT_SECRET` tiene fallback a una clave hardcodeada. Siempre cambiar en producción.
3. **Sin rate limiting**: Los endpoints de API no tienen rate limiting. Considerar agregarlo antes de exponer a internet.
4. **Sin validación de entrada robusta**: Los endpoints de API hacen `request.json()` directamente sin validación de esquema (Zod, Joi, etc.).
5. **SQL Injection**: Las queries usan parámetros posicionales (`?`) del cliente libsql, que previene SQL injection.
6. **Imágenes**: `next.config.mjs` permite solo `images.unsplash.com`. Ajustar si se migra a otro CDN.
7. **Cookies**: La cookie de admin usa `httpOnly`, `sameSite: strict` y path `/`.

---

## Dependencias Importantes

Consulta `package.json` para versiones exactas. Las más relevantes:

- `@base-ui/react` — Base de los componentes shadcn/ui
- `@libsql/client` — Cliente de base de datos
- `framer-motion` — Animaciones
- `embla-carousel-react` — Carruseles
- `lucide-react` — Iconos
- `class-variance-authority` + `clsx` + `tailwind-merge` — Sistema de variantes de shadcn/ui

---

## Notas para Agentes

- **No asumas que existe una base de datos**: El código está diseñado para funcionar 100% con datos mock. Cualquier cambio en la capa de datos debe mantener el fallback a `src/data/`.
- **Mantén el idioma español**: Todo el contenido visible, textos de UI, mensajes de error y metadata debe estar en español.
- **Mantén el formato de precios MXN**: Usa siempre `Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })`.
- **No rompas el patrón de shadcn/ui**: Si agregas componentes de UI, siguen la estructura de variantes con `cva` y la función `cn()`.
- **Responde mobile-first**: Todas las páginas usan clases responsive de Tailwind. Verifica que los cambios funcionen en móvil.
- **WhatsApp**: El número de teléfono está hardcodeado en `src/hooks/useWhatsApp.ts` (`5214421234567`). Si se cambia, también actualizar `DEFAULT_SETTINGS` en `src/app/api/settings/route.ts` y `src/lib/db/schema.sql`.
