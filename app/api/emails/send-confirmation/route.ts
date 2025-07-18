import { type NextRequest, NextResponse } from "next/server"

const RESEND_API_KEY = process.env.RESEND_API_KEY

interface EmailRequest {
  to: string
  userName: string
  numbers: number[]
  totalAmount: number
  paymentId: string
}

export async function POST(request: NextRequest) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const { to, userName, numbers, totalAmount, paymentId }: EmailRequest = await request.json()

    const numbersFormatted = numbers.map((n) => n.toString().padStart(5, "0")).join(", ")
    const purchaseDate = new Date().toLocaleString("es-AR")

    const emailHtml = `
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
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>¡Felicitaciones! Tu compra ha sido procesada exitosamente.</p>
            
            <div class="numbers">
              <h3>📋 Detalles de tu compra:</h3>
              <p><strong>Números comprados:</strong> ${numbersFormatted}</p>
              <p><strong>Cantidad:</strong> ${numbers.length} números</p>
              <p><strong>Total pagado:</strong> $${totalAmount.toLocaleString()}</p>
              <p><strong>Fecha:</strong> ${purchaseDate}</p>
              <p><strong>ID de pago:</strong> ${paymentId}</p>
            </div>
            
            <div class="prize-info">
              <h3>🏆 Premio del Sorteo:</h3>
              <p><strong>Camiseta de la Selección Argentina</strong> firmada por todos los jugadores del plantel actual</p>
              <p>Una pieza única y exclusiva para el verdadero hincha argentino</p>
            </div>
            
            <p><strong>Próximos pasos:</strong></p>
            <ul>
              <li>Guarda este email como comprobante</li>
              <li>El sorteo se realizará el 31 de Diciembre 2024</li>
              <li>Te notificaremos si resultas ganador</li>
            </ul>
            
            <p>¡Mucha suerte! 🍀</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Enviar email usando Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rifa Digital <noreply@tu-dominio.com>",
        to: [to],
        subject: "✅ Confirmación de Compra - Rifa Digital 2024",
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error("Resend API Error:", errorData)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    const emailData = await emailResponse.json()
    return NextResponse.json({ success: true, emailId: emailData.id })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
