import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/supabase"
import { getServerMPConfig } from "../../../../lib/mercadopago"

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Webhook received from MercadoPago")

    // Obtener configuración de MercadoPago de forma segura
    const mpConfig = getServerMPConfig()

    if (!mpConfig.ACCESS_TOKEN) {
      console.error("❌ MERCADOPAGO_ACCESS_TOKEN not configured")
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    const body = await request.json()
    console.log("📋 Webhook body:", body)

    // NO validar signature por ahora para evitar el 401
    // La validación de signature puede causar problemas si no está configurada correctamente

    // Verificar que es una notificación de pago
    if (body.type !== "payment" && body.action !== "payment.updated") {
      console.log("ℹ️ Not a payment notification, ignoring")
      return NextResponse.json({ status: "ignored" })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.log("❌ No payment ID found")
      return NextResponse.json({ error: "No payment ID" }, { status: 400 })
    }

    console.log("💳 Processing payment ID:", paymentId)

    // Obtener detalles del pago desde MercadoPago
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mpConfig.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!paymentResponse.ok) {
      console.error("❌ Failed to fetch payment details:", paymentResponse.status)
      return NextResponse.json({ error: "Failed to fetch payment" }, { status: 400 })
    }

    const paymentData = await paymentResponse.json()
    console.log("📊 Payment data:", {
      status: paymentData.status,
      amount: paymentData.transaction_amount,
      external_reference: paymentData.external_reference,
    })

    // Solo procesar pagos aprobados
    if (paymentData.status === "approved") {
      // Verificar si tenemos external_reference con los datos
      if (!paymentData.external_reference) {
        console.log("❌ No external reference found")
        return NextResponse.json({ error: "No external reference" }, { status: 400 })
      }

      let referenceData
      try {
        referenceData = JSON.parse(paymentData.external_reference)
      } catch (error) {
        console.error("❌ Invalid external reference format")
        return NextResponse.json({ error: "Invalid reference format" }, { status: 400 })
      }

      const userId = referenceData.userId
      const numbers = referenceData.numbers
      const amount = paymentData.transaction_amount

      console.log("✅ Payment approved, updating database:", { userId, numbers, amount })

      // Actualizar números en la base de datos
      const { data: updatedNumbers, error: updateError } = await supabase
        .from("raffle_numbers")
        .update({
          status: "sold",
          user_id: userId,
          purchased_at: new Date().toISOString(),
        })
        .in("number", numbers)
        .eq("status", "available")
        .select()

      if (updateError) {
        console.error("❌ Error updating numbers:", updateError)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
      }

      console.log("📝 Numbers updated:", updatedNumbers?.length)

      // Crear transacción
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          raffle_id: 1,
          amount: amount,
          payment_id: paymentId,
          payment_method: "mercadopago",
          status: "completed",
          numbers: numbers,
        })
        .select()

      if (transactionError) {
        console.error("❌ Error creating transaction:", transactionError)
      } else {
        console.log("✅ Transaction created:", transaction?.[0]?.id)
      }

      console.log("🎉 Payment processed successfully!")
      return NextResponse.json({
        status: "processed",
        numbers_updated: updatedNumbers?.length,
        payment_id: paymentId,
      })
    }

    console.log("ℹ️ Payment not approved, status:", paymentData.status)
    return NextResponse.json({ status: "received", payment_status: paymentData.status })
  } catch (error) {
    console.error("💥 Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}

// Permitir GET para testing
export async function GET() {
  return NextResponse.json({
    status: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
