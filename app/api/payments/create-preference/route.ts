import { type NextRequest, NextResponse } from "next/server"
import { getServerMPConfig } from "../../../../lib/mercadopago"

interface PaymentRequest {
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

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Creating payment preference...")

    // Obtener configuración de MercadoPago de forma segura
    const mpConfig = getServerMPConfig()

    if (!mpConfig.ACCESS_TOKEN) {
      console.error("❌ MERCADOPAGO_ACCESS_TOKEN not configured")
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    const body: PaymentRequest = await request.json()
    const { items, payer, external_reference, selectedNumbers, userId } = body

    console.log("📋 Payment data:", {
      itemsCount: items.length,
      numbersCount: selectedNumbers.length,
      userId,
      payerEmail: payer.email,
    })

    if (!selectedNumbers || selectedNumbers.length === 0) {
      return NextResponse.json({ error: "No numbers selected" }, { status: 400 })
    }

    // Crear preferencia de pago en MercadoPago
    const paymentData = {
      items: items.map((item) => ({
        ...item,
        description: `Números de rifa: ${selectedNumbers.join(", ")}`,
        category_id: "tickets",
      })),
      payer: {
        name: payer.name,
        surname: payer.surname,
        email: payer.email,
        phone: payer.phone,
        identification: payer.identification,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-responsive-rifa-website.vercel.app"}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-responsive-rifa-website.vercel.app"}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-responsive-rifa-website.vercel.app"}/payment/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-responsive-rifa-website.vercel.app"}/api/webhooks/mercadopago`,
      external_reference,
      metadata: {
        user_id: userId.toString(),
        numbers: selectedNumbers.join(","),
        numbers_count: selectedNumbers.length.toString(),
      },
      expires: false,
      binary_mode: false,
    }

    console.log("🚀 Sending to MercadoPago API...")

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpConfig.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `${userId}-${Date.now()}`,
      },
      body: JSON.stringify(paymentData),
    })

    const responseText = await response.text()
    console.log("📥 MercadoPago response status:", response.status)
    console.log("📥 MercadoPago response:", responseText.substring(0, 500))

    if (!response.ok) {
      console.error("❌ MercadoPago API Error:", responseText)
      return NextResponse.json(
        {
          error: "Error creating payment preference",
          details: responseText.substring(0, 200),
        },
        { status: 500 },
      )
    }

    const preferenceData = JSON.parse(responseText)

    console.log("✅ Payment preference created:", preferenceData.id)

    return NextResponse.json({
      id: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
      status: "created",
    })
  } catch (error) {
    console.error("💥 Payment creation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
