-- Agregar configuración de la rifa
ALTER TABLE raffles ADD COLUMN IF NOT EXISTS draw_date TIMESTAMP;
ALTER TABLE raffles ADD COLUMN IF NOT EXISTS prize_description TEXT;
ALTER TABLE raffles ADD COLUMN IF NOT EXISTS prize_image_url TEXT;
ALTER TABLE raffles ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;

-- Actualizar la rifa principal con información del sorteo
UPDATE raffles 
SET 
  draw_date = '2024-12-31 20:00:00',
  prize_description = 'Camiseta de la Selección Argentina firmada por todos los jugadores del plantel actual',
  prize_image_url = '/placeholder.svg?height=400&width=400',
  terms_and_conditions = 'Términos y condiciones: 1) Solo mayores de 18 años. 2) Un número por persona máximo. 3) El sorteo se realizará en vivo. 4) El ganador será contactado por email y teléfono. 5) El premio debe ser retirado en un plazo de 30 días.',
  updated_at = NOW()
WHERE id = 1;

-- Agregar tabla para configuración de emails
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar templates de email
INSERT INTO email_templates (template_name, subject, html_content, text_content) VALUES
('purchase_confirmation', '✅ Confirmación de Compra - Rifa Digital 2024', 
 'Template HTML para confirmación de compra', 
 'Template texto para confirmación de compra'),
('raffle_info', '🏆 Información del Sorteo - Rifa Digital 2024', 
 'Template HTML para información del sorteo', 
 'Template texto para información del sorteo');

-- Agregar campos para tracking de emails
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP;
