-- Crear tabla de rifas
CREATE TABLE raffles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  total_numbers INTEGER NOT NULL DEFAULT 50000,
  price_per_number DECIMAL(10,2) NOT NULL DEFAULT 1000,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  draw_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de números
CREATE TABLE raffle_numbers (
  id SERIAL PRIMARY KEY,
  raffle_id INTEGER REFERENCES raffles(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 1000,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  purchased_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(raffle_id, number)
);

-- Crear tabla de transacciones
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  raffle_id INTEGER REFERENCES raffles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_id VARCHAR(100),
  payment_method VARCHAR(50) DEFAULT 'mercadopago',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX idx_raffle_numbers_status ON raffle_numbers(status);
CREATE INDEX idx_raffle_numbers_user_id ON raffle_numbers(user_id);
CREATE INDEX idx_raffle_numbers_number ON raffle_numbers(number);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_dni ON users(dni);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_raffles_updated_at BEFORE UPDATE ON raffles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_raffle_numbers_updated_at BEFORE UPDATE ON raffle_numbers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
