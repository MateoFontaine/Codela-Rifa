-- Este script debe ejecutarse DESPUÉS de crear el usuario admin manualmente en Supabase Auth

-- Actualizar el perfil del admin (reemplaza 'admin-uuid-aqui' con el UUID real del usuario admin)
-- Para obtener el UUID: ve a Authentication > Users en Supabase Dashboard

UPDATE profiles 
SET 
  role = 'admin',
  name = 'Administrador',
  last_name = 'Sistema',
  dni = '00000000'
WHERE email = 'admin@rifa.com';

-- Verificar que se creó correctamente
SELECT * FROM profiles WHERE email = 'admin@rifa.com';
