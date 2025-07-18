-- Limpiar todas las tablas
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE raffle_numbers CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE raffles CASCADE;

-- Reinsertar la rifa principal
INSERT INTO raffles (name, description, total_numbers, price_per_number, status) 
VALUES (
  'Rifa Digital 2024', 
  'Gran rifa de 50,000 números con increíbles premios',
  50000,
  1000,
  'active'
);

-- Reinsertar números del 1 al 50,000 para la rifa
INSERT INTO raffle_numbers (raffle_id, number, price) 
SELECT 1, generate_series(1, 50000), 1000;

-- Crear tabla de perfiles de usuario (conectada con Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  last_name TEXT,
  dni TEXT UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Actualizar tabla users para conectar con auth
ALTER TABLE users ADD COLUMN auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Crear función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_user_role() = 'admin');

-- Políticas para users (tabla legacy)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (get_user_role() = 'admin');

-- Políticas para raffle_numbers
CREATE POLICY "Anyone can view available numbers" ON raffle_numbers
  FOR SELECT USING (status = 'available');

CREATE POLICY "Users can view own numbers" ON raffle_numbers
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all numbers" ON raffle_numbers
  FOR SELECT USING (get_user_role() = 'admin');

CREATE POLICY "System can update numbers" ON raffle_numbers
  FOR UPDATE USING (true);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (get_user_role() = 'admin');

CREATE POLICY "System can insert transactions" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update transactions" ON transactions
  FOR UPDATE USING (true);
