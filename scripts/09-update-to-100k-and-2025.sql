-- Script para actualizar la rifa a 100,000 números y año 2025
-- Ejecutar en el SQL Editor de Supabase

-- 1. Primero, verificar cuántos números tenemos actualmente
SELECT COUNT(*) as total_numbers FROM raffle_numbers;

-- 2. Si tenemos menos de 100,000, agregar los números faltantes
DO $$
DECLARE
    current_max INTEGER;
    target_max INTEGER := 100000;
BEGIN
    -- Obtener el número máximo actual
    SELECT COALESCE(MAX(number), 0) INTO current_max FROM raffle_numbers;
    
    -- Si tenemos menos de 100,000 números, agregar los faltantes
    IF current_max < target_max THEN
        -- Insertar números desde current_max + 1 hasta 100,000
        INSERT INTO raffle_numbers (number, is_available, created_at)
        SELECT 
            generate_series(current_max + 1, target_max) as number,
            true as is_available,
            NOW() as created_at;
        
        RAISE NOTICE 'Se agregaron % números nuevos', (target_max - current_max);
    ELSE
        RAISE NOTICE 'Ya existen % números en la base de datos', current_max;
    END IF;
END $$;

-- 3. Verificar el resultado
SELECT 
    COUNT(*) as total_numbers,
    COUNT(*) FILTER (WHERE is_available = true) as available_numbers,
    COUNT(*) FILTER (WHERE is_available = false) as sold_numbers
FROM raffle_numbers;

-- 4. Actualizar configuración de la rifa si existe tabla de configuración
-- (Este paso es opcional, las constantes están en el código)
UPDATE raffle_config 
SET 
    total_numbers = 100000,
    raffle_name = 'Rifa Digital 2025',
    updated_at = NOW()
WHERE id = 1;

-- 5. Verificar que todos los números estén en el rango correcto
SELECT 
    MIN(number) as min_number,
    MAX(number) as max_number,
    COUNT(*) as total_count
FROM raffle_numbers;

-- 6. Mostrar estadísticas finales
SELECT 
    'Configuración actualizada correctamente' as status,
    COUNT(*) as total_numbers,
    COUNT(*) FILTER (WHERE is_available = true) as available,
    COUNT(*) FILTER (WHERE is_available = false) as sold,
    ROUND((COUNT(*) FILTER (WHERE is_available = false)::decimal / COUNT(*)) * 100, 2) as sold_percentage
FROM raffle_numbers;
