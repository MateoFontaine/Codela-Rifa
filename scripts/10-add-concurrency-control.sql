-- Script para control de concurrencia
ALTER TABLE raffle_numbers
ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE OR REPLACE FUNCTION reserve_number(
    p_number INTEGER,
    p_user_id INTEGER,
    p_current_version INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE raffle_numbers
    SET 
        user_id = p_user_id,
        version = version + 1,
        status = 'reserved',
        updated_at = NOW()
    WHERE 
        number = p_number AND 
        version = p_current_version AND
        status = 'available';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
