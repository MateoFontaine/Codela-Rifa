-- Insertar rifa principal
INSERT INTO raffles (name, description, total_numbers, price_per_number, status) 
VALUES (
  'Rifa Digital 2024', 
  'Gran rifa de 50,000 números con increíbles premios',
  50000,
  1000,
  'active'
);

-- Insertar números del 1 al 50,000 para la rifa
INSERT INTO raffle_numbers (raffle_id, number, price) 
SELECT 1, generate_series(1, 50000), 1000;

-- Insertar algunos usuarios de ejemplo
INSERT INTO users (name, last_name, email, dni, phone) VALUES
('Juan Carlos', 'Pérez', 'juan.perez@email.com', '12345678', '11-1234-5678'),
('María Elena', 'González', 'maria.gonzalez@email.com', '23456789', '11-2345-6789'),
('Roberto', 'Martínez', 'roberto.martinez@email.com', '34567890', '11-3456-7890'),
('Ana Sofía', 'López', 'ana.lopez@email.com', '45678901', '11-4567-8901'),
('Carlos Eduardo', 'Rodríguez', 'carlos.rodriguez@email.com', '56789012', '11-5678-9012');

-- Simular algunas compras
UPDATE raffle_numbers 
SET user_id = 1, status = 'sold', purchased_at = NOW() - INTERVAL '2 days'
WHERE number IN (1234, 5678, 9012, 3456, 7890);

UPDATE raffle_numbers 
SET user_id = 2, status = 'sold', purchased_at = NOW() - INTERVAL '1 day'
WHERE number IN (2468, 1357, 9753);

UPDATE raffle_numbers 
SET user_id = 3, status = 'sold', purchased_at = NOW() - INTERVAL '3 hours'
WHERE number IN (1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888);

-- Insertar transacciones de ejemplo
INSERT INTO transactions (user_id, raffle_id, amount, payment_id, status, numbers) VALUES
(1, 1, 5000, 'MP_12345', 'completed', ARRAY[1234, 5678, 9012, 3456, 7890]),
(2, 1, 3000, 'MP_23456', 'completed', ARRAY[2468, 1357, 9753]),
(3, 1, 8000, 'MP_34567', 'completed', ARRAY[1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888]);
