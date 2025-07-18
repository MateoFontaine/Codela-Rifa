-- Agregar campo password a la tabla users
ALTER TABLE users ADD COLUMN password VARCHAR(255);

-- Limpiar datos ficticios existentes
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE raffle_numbers CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reinsertar la rifa principal
INSERT INTO raffles (name, description, total_numbers, price_per_number, status) 
VALUES (
  'Rifa Digital 2024', 
  'Gran rifa de 50,000 números con increíbles premios',
  50000,
  1000,
  'active'
) ON CONFLICT DO NOTHING;

-- Reinsertar números del 1 al 50,000 para la rifa
INSERT INTO raffle_numbers (raffle_id, number, price) 
SELECT 1, generate_series(1, 50000), 1000
WHERE NOT EXISTS (SELECT 1 FROM raffle_numbers WHERE raffle_id = 1);

-- Crear usuario admin de ejemplo (opcional)
INSERT INTO users (name, last_name, email, dni, phone, password) 
VALUES ('Admin', 'Sistema', 'admin@rifa.com', '00000000', '11-0000-0000', 'admin123')
ON CONFLICT (email) DO NOTHING;
