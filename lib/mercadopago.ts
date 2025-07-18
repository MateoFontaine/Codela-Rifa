// Configuración de MercadoPago - SOLO para servidor
// ❌ NO exportar las variables directamente para evitar acceso desde cliente

// Esta configuración solo debe usarse en API routes (servidor)
export const getServerMPConfig = () => {
  // Verificar que estamos en el servidor
  if (typeof window !== "undefined") {
    throw new Error("MercadoPago config should only be accessed on server side")
  }

  return {
    ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
    WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET,
  }
}

export interface PaymentData {
  items: {
    title: string
    quantity: number
    unit_price: number
    currency_id: string
  }[]
  payer: {
    name: string
    surname: string
    email: string
    phone?: {
      area_code: string
      number: string
    }
    identification?: {
      type: string
      number: string
    }
  }
  external_reference: string
  selectedNumbers: number[]
  userId: number
}

export interface PaymentResponse {
  id: string
  init_point: string
  sandbox_init_point: string
  status: string
}

// Función para crear preferencia de pago (desde el cliente hacia API)
export async function createPaymentPreference(paymentData: PaymentData): Promise<PaymentResponse> {
  const response = await fetch("/api/payments/create-preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Error creating payment preference")
  }

  return response.json()
}

// Función para enviar email de confirmación
export async function sendConfirmationEmail(emailData: {
  to: string
  userName: string
  numbers: number[]
  totalAmount: number
  paymentId: string
}): Promise<boolean> {
  try {
    const response = await fetch("/api/emails/send-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return false
  }
}
