# 🚀 Setup de Supabase - Guía Completa

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta o inicia sesión
4. Haz clic en "New Project"
5. Completa:
   - **Name**: `rifa-digital`
   - **Database Password**: (guarda esta contraseña)
   - **Region**: South America (São Paulo) - más cerca de Argentina
6. Haz clic en "Create new project"
7. Espera 2-3 minutos a que se cree

## 2. Obtener Credenciales

1. En tu proyecto, ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

## 3. Configurar Variables de Entorno

1. Crea el archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza con tus valores reales:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
\`\`\`

## 4. Ejecutar Scripts SQL

1. Ve a **SQL Editor** en tu proyecto Supabase
2. Ejecuta los scripts en orden:
   - Primero: `scripts/01-create-tables.sql`
   - Segundo: `scripts/02-seed-data.sql`

## 5. Verificar Instalación

1. Ve a **Table Editor** en Supabase
2. Deberías ver las tablas:
   - `raffles` (1 rifa)
   - `users` (5 usuarios de ejemplo)
   - `raffle_numbers` (50,000 números)
   - `transactions` (3 transacciones de ejemplo)

## 6. Instalar Dependencias

\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

## 7. Probar Conexión

\`\`\`bash
npm run dev
\`\`\`

¡Listo! Tu base de datos está configurada y funcionando.

## 🔒 Configuración de Seguridad (RLS)

Por ahora las tablas están abiertas para desarrollo. Más adelante configuraremos Row Level Security.

## 📊 Datos de Prueba

- **5 usuarios** de ejemplo
- **50,000 números** disponibles
- **Algunos números ya vendidos** para testing
- **3 transacciones** completadas

## 🚨 Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste bien la `anon key`
- Asegúrate que el archivo `.env.local` esté en la raíz

### Error: "Failed to fetch"
- Verifica la URL del proyecto
- Asegúrate que el proyecto esté activo en Supabase

### Tablas no aparecen
- Ejecuta los scripts SQL en el orden correcto
- Verifica que no haya errores en el SQL Editor
