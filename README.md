# Concurso ESPOCH 2026

Aplicación web desarrollada para el proyecto **Concurso ESPOCH 2026**.

Actualmente el repositorio está organizado en dos partes principales:

- `frontend`: aplicación cliente construida con **React**, **Vite**, **TanStack Router**, **Tailwind CSS** y **Supabase**
- `backend`: base inicial con **Bun** y **TypeScript**

---

## Estructura del proyecto

```txt
concurso_espoch_26/
├── frontend/
├── backend/
├── DATABASE.md
└── README.md
```

---

## Stack principal

### Frontend
- Bun
- React 19
- Vite
- TanStack Router
- Tailwind CSS 4
- Supabase JS
- React Hook Form
- Zod
- Biome
- Vitest

### Backend
- Bun
- TypeScript

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) disponible en tu `PATH`

> El frontend genera tipos de base de datos automáticamente usando la CLI de Supabase antes de iniciar en modo desarrollo.

---

## Clonar el repositorio

```bash
git clone https://github.com/AndresGaibor/concurso_espoch_26.git
cd concurso_espoch_26
```

---

## Setup del frontend

### 1) Entrar a la carpeta del frontend

```bash
cd frontend
```

### 2) Instalar dependencias

```bash
bun install
```

### 3) Crear variables de entorno

Crea un archivo `.env.local` dentro de `frontend/`:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=TU_SUPABASE_ANON_KEY
```

### 4) Levantar el proyecto en desarrollo

```bash
bun run dev
```

La aplicación se iniciará en:

```txt
http://localhost:3000
```

> El proyecto usa `strictPort`, por lo que si el puerto `3000` está ocupado, Vite fallará en lugar de cambiar automáticamente a otro puerto.

---

## Scripts disponibles en frontend

```bash
bun run dev         # Genera tipos de Supabase y levanta Vite en puerto 3000
bun run build       # Build de producción
bun run preview     # Vista previa del build
bun run test        # Ejecuta tests con Vitest
bun run check       # Revisión con Biome
bun run check:fix   # Corrige problemas detectados por Biome
bun run typecheck   # Verificación de tipos con TypeScript
bun run format      # Formatea el código
bun run db:types    # Regenera tipos desde Supabase
```

---

## Tipado de Supabase

El frontend obtiene tipos de la base de datos con este flujo:

```bash
bun run db:types
```

Esto genera el archivo:

```txt
src/types/database.ts
```

### Importante

Para que este paso funcione correctamente:

- debes tener instalada la **Supabase CLI**
- debes tener acceso al proyecto de Supabase correspondiente
- tu sesión de Supabase CLI debe estar autenticada si el comando lo requiere

Si el comando falla, revisa primero:

```bash
supabase --version
```

---

## Setup del backend

### 1) Entrar a la carpeta del backend

```bash
cd ../backend
```

### 2) Instalar dependencias

```bash
bun install
```

### Estado actual del backend

Por ahora, el backend está solo como una base inicial del proyecto.  
Todavía no incluye un flujo formal de desarrollo con scripts como `dev`, `start` o `build`.

Por eso, la recomendación actual es:

- usar el frontend como parte principal del desarrollo
- completar primero la estructura y scripts del backend antes de documentar un flujo definitivo de ejecución

---

## Flujo recomendado de desarrollo

### Frontend
```bash
cd frontend
bun install
bun run dev
```

### Backend
```bash
cd backend
bun install
```

---

## Solución de problemas

### Error: faltan variables de entorno de Supabase
Verifica que exista `frontend/.env.local` y que tenga estas variables:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

### Error al generar tipos con Supabase
Revisa que la CLI esté instalada y disponible:

```bash
supabase --version
```

### El puerto 3000 ya está ocupado
Cierra el proceso que está usando el puerto `3000` o ajusta manualmente la configuración del frontend.

### Fallo al ejecutar backend
Es normal que todavía no exista un flujo estable de ejecución del backend, porque actualmente está en fase inicial.

---

## Recomendaciones

- mantener las credenciales en `.env.local`
- no subir archivos `.env*` al repositorio
- regenerar tipos de Supabase cuando cambie el esquema de la base de datos
- usar `bun run check` y `bun run typecheck` antes de hacer commits

---

## Estado del proyecto

Este repositorio ya tiene una base sólida en el frontend, con integración a Supabase y tooling moderno.  
El backend aún requiere consolidación para quedar listo como parte formal del entorno de desarrollo.

---

## Autor

**Andres Gaibor**  
Repositorio: <https://github.com/AndresGaibor/concurso_espoch_26>
