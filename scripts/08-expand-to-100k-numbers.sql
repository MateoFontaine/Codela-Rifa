-- Expandir la rifa de 50,000 a 100,000 números
-- Este script agrega los números del 50,001 al 100,000

-- 1. Actualizar la configuración de la rifa principal
UPDATE raffles 
SET 
  total_numbers = 100000,
  description = 'Gran rifa de 100,000 números con increíbles premios',
  updated_at = NOW()
WHERE id = 1;

-- 2. Verificar cuántos números tenemos actualmente
SELECT COUNT(*) as numeros_actuales FROM raffle_numbers WHERE raffle_id = 1;

-- 3. Agregar los números faltantes (del 50,001 al 100,000)
INSERT INTO raffle_numbers (raffle_id, number, price) 
SELECT 1, generate_series(50001, 100000), 1000
WHERE NOT EXISTS (
  SELECT 1 FROM raffle_numbers WHERE raffle_id = 1 AND number > 50000
);

-- 4. Verificar que ahora tenemos 100,000 números
SELECT COUNT(*) as total_numeros FROM raffle_numbers WHERE raffle_id = 1;
SELECT MIN(number) as numero_minimo, MAX(number) as numero_maximo FROM raffle_numbers WHERE raffle_id = 1;

-- 5. Verificar distribución de estados
SELECT 
  status,
  COUNT(*) as cantidad,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM raffle_numbers WHERE raffle_id = 1)), 2) as porcentaje
FROM raffle_numbers 
WHERE raffle_id = 1 
GROUP BY status
ORDER BY cantidad DESC;

-- 6. Crear índices adicionales para mejor performance con 100k números
CREATE INDEX IF NOT EXISTS idx_raffle_numbers_raffle_status ON raffle_numbers(raffle_id, status);
CREATE INDEX IF NOT EXISTS idx_raffle_numbers_range ON raffle_numbers(raffle_id, number) WHERE number BETWEEN 1 AND 100000;

-- 7. Mensaje de confirmación
SELECT 
  'Rifa expandida exitosamente a 100,000 números' as mensaje,
  COUNT(*) as total_numeros,
  COUNT(*) FILTER (WHERE status = 'available') as disponibles,
  COUNT(*) FILTER (WHERE status = 'sold') as vendidos
FROM raffle_numbers 
WHERE raffle_id = 1;
