-- Deshabilitar confirmación de email para desarrollo
-- Esto permite que los usuarios se registren sin confirmar email

-- Actualizar la configuración de auth en Supabase
-- NOTA: Esto debe ejecutarse en el SQL Editor de Supabase

-- Para usuarios existentes que no han confirmado email
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Verificar que el admin esté confirmado
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email = 'admin@rifa.com';
