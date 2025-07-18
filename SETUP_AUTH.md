# 🔐 Setup de Autenticación - Guía Completa

## 1. Ejecutar Scripts SQL

### Paso 1: Limpiar y configurar tablas
1. Ve a **SQL Editor** en Supabase
2. Ejecuta `scripts/03-reset-and-auth.sql`
3. Esto limpiará todas las tablas y configurará la autenticación

## 2. Crear Usuario Admin Manualmente

### Paso 2: Crear admin en Supabase Auth
1. Ve a **Authentication** → **Users** en Supabase
2. Haz clic en **"Add user"**
3. Completa:
   - **Email**: `admin@rifa.com`
   - **Password**: `admin123`
   - **Auto Confirm User**: ✅ (marcado)
4. Haz clic en **"Create user"**

### Paso 3: Configurar rol de admin
1. Copia el **UUID** del usuario admin que acabas de crear
2. Ve a **SQL Editor**
3. Ejecuta `scripts/04-create-admin.sql`
4. Reemplaza `'admin-uuid-aqui'` con el UUID real del admin

## 3. Probar el Sistema

### Credenciales de Admin:
- **Email**: admin@rifa.com
- **Contraseña**: admin123

### Para crear usuarios normales:
- Usa el formulario de registro en la aplicación
- Los usuarios normales tendrán rol 'user' automáticamente

## 4. Funcionalidades Implementadas

### ✅ Login/Register
- Modal de autenticación completo
- Validación de formularios
- Manejo de errores

### ✅ Roles de Usuario
- **user**: Puede comprar números y ver sus compras
- **admin**: Acceso completo al panel de administración

### ✅ Seguridad (RLS)
- Row Level Security habilitado
- Los usuarios solo ven sus propios datos
- Los admins ven todo

### ✅ Protección de Rutas
- Vista admin solo para administradores
- Redirección automática al login

## 5. Estructura de Datos

### Tabla `profiles`:
- Conectada con `auth.users`
- Contiene información adicional del usuario
- Campo `role` para permisos

### Políticas de Seguridad:
- Usuarios ven solo sus datos
- Admins ven todos los datos
- Sistema puede actualizar números y transacciones

## 6. Testing

1. **Registro**: Crea una cuenta nueva
2. **Login Usuario**: Inicia sesión con cuenta normal
3. **Login Admin**: Usa admin@rifa.com / admin123
4. **Permisos**: Verifica que usuarios normales no accedan al admin

¡Listo! El sistema de autenticación está completo y funcionando.
