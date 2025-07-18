// Sistema de notificaciones por email
export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export interface PurchaseConfirmationData {
  userName: string
  userEmail: string
  numbers: number[]
  totalAmount: number
  paymentId: string
  purchaseDate: string
}

export interface RaffleInfoData {
  raffleName: string
  drawDate: string
  prize: string
  totalNumbers: number
  pricePerNumber: number
}

// Template para confirmación de compra
export function createPurchaseConfirmationEmail(data: PurchaseConfirmationData): EmailTemplate {
  const numbersFormatted = data.numbers.map((n) => n.toString().padStart(5, "0")).join(", ")

  return {
    to: data.userEmail,
    subject: "✅ Confirmación de Compra - Rifa Digital 2024",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .numbers { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .prize-info { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎲 Rifa Digital 2024</h1>
            <h2>¡Compra Confirmada!</h2>
          </div>
          
          <div class="content">
            <p>Hola <strong>${data.userName}</strong>,</p>
            
            <p>¡Felicitaciones! Tu compra ha sido procesada exitosamente.</p>
            
            <div class="numbers">
              <h3>📋 Detalles de tu compra:</h3>
              <p><strong>Números comprados:</strong> ${numbersFormatted}</p>
              <p><strong>Cantidad:</strong> ${data.numbers.length} números</p>
              <p><strong>Total pagado:</strong> $${data.totalAmount.toLocaleString()}</p>
              <p><strong>Fecha:</strong> ${data.purchaseDate}</p>
              <p><strong>ID de pago:</strong> ${data.paymentId}</p>
            </div>
            
            <div class="prize-info">
              <h3>🏆 Premio del Sorteo:</h3>
              <p><strong>Camiseta de la Selección Argentina</strong> firmada por todos los jugadores del plantel actual</p>
              <p>Una pieza única y exclusiva para el verdadero hincha argentino</p>
            </div>
            
            <p><strong>Próximos pasos:</strong></p>
            <ul>
              <li>Guarda este email como comprobante</li>
              <li>El sorteo se realizará en la fecha programada</li>
              <li>Te notificaremos si resultas ganador</li>
            </ul>
            
            <p>¡Mucha suerte! 🍀</p>
          </div>
          
          <div class="footer">
            <p>Rifa Digital 2024 - Sistema Seguro de Rifas Online</p>
            <p>Este es un email automático, no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Rifa Digital 2024 - Compra Confirmada
      
      Hola ${data.userName},
      
      Tu compra ha sido procesada exitosamente:
      - Números: ${numbersFormatted}
      - Cantidad: ${data.numbers.length}
      - Total: $${data.totalAmount.toLocaleString()}
      - Fecha: ${data.purchaseDate}
      - ID: ${data.paymentId}
      
      Premio: Camiseta de la Selección Argentina firmada
      
      ¡Mucha suerte!
    `,
  }
}

// Template para información del sorteo
export function createRaffleInfoEmail(userEmail: string, data: RaffleInfoData): EmailTemplate {
  return {
    to: userEmail,
    subject: "🏆 Información del Sorteo - Rifa Digital 2024",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .prize-highlight { background: #fef3c7; border: 2px solid #f59e0b; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0ea5e9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎲 ${data.raffleName}</h1>
            <h2>Información del Sorteo</h2>
          </div>
          
          <div class="content">
            <div class="prize-highlight">
              <h2>🏆 GRAN PREMIO</h2>
              <h3>${data.prize}</h3>
              <p>Una pieza única e irrepetible para el verdadero fanático del fútbol argentino</p>
            </div>
            
            <div class="info-box">
              <h3>📅 Fecha del Sorteo:</h3>
              <p><strong>${data.drawDate}</strong></p>
            </div>
            
            <div class="info-box">
              <h3>📊 Detalles de la Rifa:</h3>
              <p><strong>Total de números:</strong> ${data.totalNumbers.toLocaleString()}</p>
              <p><strong>Precio por número:</strong> $${data.pricePerNumber.toLocaleString()}</p>
              <p><strong>Modalidad:</strong> Un solo ganador se lleva todo</p>
            </div>
            
            <div class="info-box">
              <h3>🎯 Cómo funciona el sorteo:</h3>
              <ul>
                <li>Se realizará en vivo el día programado</li>
                <li>Se sorteará UN número ganador</li>
                <li>El propietario del número ganador se lleva el premio</li>
                <li>Notificación inmediata al ganador</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <strong>¡Participa ahora y no te pierdas esta oportunidad única!</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

// Función para enviar email (usando un servicio como Resend, SendGrid, etc.)
export async function sendEmail(emailData: EmailTemplate): Promise<boolean> {
  try {
    // Aquí integrarías con tu servicio de email preferido
    // Ejemplo con Resend:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@rifadigital.com',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    })
    
    return response.ok
    */

    // Por ahora, simulamos el envío
    console.log("📧 Email enviado:", emailData.subject, "to:", emailData.to)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}
