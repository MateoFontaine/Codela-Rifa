"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, CreditCard, Shield, Clock, AlertCircle } from "lucide-react"
import { formatCurrency } from "../lib/utils"
import { createPaymentPreference } from "../../lib/mercadopago"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedNumbers: number[]
  currentUser: any
  onPaymentSuccess: () => void
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedNumbers,
  currentUser,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "success" | "error">("confirm")
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body de múltiples maneras
      document.body.classList.add("modal-open")
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = "0"
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.bottom = "0"
      document.documentElement.style.overflow = "hidden"
    } else {
      // Restaurar scroll
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.bottom = ""
      document.documentElement.style.overflow = ""
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.bottom = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen])

  const PRICE_PER_NUMBER = 1
  const totalAmount = selectedNumbers.length * PRICE_PER_NUMBER

  if (!isOpen) return null

  const handlePayment = async () => {
    setLoading(true)
    setPaymentStep("processing")
    setError("")

    try {
      // Crear preferencia de pago
      const paymentData = {
        items: [
          {
            title: `Rifa Digital 2025 - ${selectedNumbers.length} números`,
            quantity: 1,
            unit_price: totalAmount,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: currentUser.name,
          surname: currentUser.last_name,
          email: currentUser.email,
          phone: currentUser.phone
            ? {
                area_code: "11",
                number: currentUser.phone.replace(/\D/g, ""),
              }
            : undefined,
          identification: {
            type: "DNI",
            number: currentUser.dni,
          },
        },
        external_reference: `user_${currentUser.id}_${Date.now()}`,
        selectedNumbers,
        userId: currentUser.id,
      }

      console.log("🚀 Creating payment preference...")
      const paymentResponse = await createPaymentPreference(paymentData)
      console.log("✅ Payment preference created:", paymentResponse.id)

      // Cerrar modal antes de redirigir
      onClose()

      // Redirigir a MercadoPago
      window.location.href = paymentResponse.init_point
    } catch (err: any) {
      console.error("❌ Payment error:", err)
      setError(err.message || "Error al procesar el pago")
      setPaymentStep("error")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (paymentStep !== "processing") {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg h-auto max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {paymentStep === "confirm" && "Confirmar Pago"}
                {paymentStep === "processing" && "Procesando Pago"}
                {paymentStep === "success" && "Pago Exitoso"}
                {paymentStep === "error" && "Error en el Pago"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {paymentStep === "confirm" && "Revisa los detalles antes de pagar"}
                {paymentStep === "processing" && "Redirigiendo a MercadoPago..."}
                {paymentStep === "success" && "Tu compra fue procesada exitosamente"}
                {paymentStep === "error" && "Hubo un problema con el pago"}
              </p>
            </div>
            {paymentStep !== "processing" && (
              <Button variant="ghost" size="sm" onClick={handleClose} className="ml-2 flex-shrink-0">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-gray-50">
          {paymentStep === "confirm" && (
            <div className="space-y-3">
              {/* Resumen de compra - más compacto */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h3 className="font-medium mb-2 text-sm text-gray-900">Resumen de Compra</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Números:</span>
                    <span className="font-medium text-gray-900">{selectedNumbers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio c/u:</span>
                    <span className="text-gray-900">{formatCurrency(PRICE_PER_NUMBER)}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-bold text-sm">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Números seleccionados - más compacto, SIN scroll interno */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h4 className="font-medium mb-2 text-sm text-gray-900">Tus números:</h4>
                <div className="bg-gray-50 border rounded-lg p-2">
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                    {selectedNumbers.slice(0, 12).map((num) => (
                      <div key={num} className="bg-yellow-100 border border-yellow-300 rounded px-1 py-1 text-center">
                        <span className="text-[10px] font-mono text-yellow-800">{num.toString().padStart(5, "0")}</span>
                      </div>
                    ))}
                  </div>
                  {selectedNumbers.length > 12 && (
                    <p className="text-[10px] text-gray-500 mt-1 text-center">
                      +{selectedNumbers.length - 12} números más
                    </p>
                  )}
                </div>
              </div>

              {/* Premio - más compacto */}
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-3 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-1 text-sm">🏆 Premio</h4>
                <p className="text-xs text-blue-700">
                  <strong>Camiseta Argentina</strong> firmada por el plantel
                </p>
              </div>

              {/* Seguridad - más compacto */}
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 p-2 rounded-lg border border-green-200">
                <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>Pago seguro con MercadoPago</span>
              </div>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="font-medium mb-2 text-lg text-gray-900">Redirigiendo a MercadoPago...</h3>
              <p className="text-sm text-gray-600 mb-4">Te estamos llevando a la plataforma de pago segura</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Esto puede tomar unos segundos</span>
              </div>
            </div>
          )}

          {paymentStep === "error" && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="font-medium text-red-800 mb-2 text-lg">Error en el Pago</h3>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => setPaymentStep("confirm")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Intentar Nuevamente
                </Button>
                <Button onClick={handleClose} variant="outline" className="w-full bg-transparent" size="lg">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Botón fijo en la parte inferior */}
        {paymentStep === "confirm" && (
          <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
            <Button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              size="lg"
              disabled={loading}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar {formatCurrency(totalAmount)}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
