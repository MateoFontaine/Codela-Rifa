"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, RefreshCw, Home, MessageCircle } from "lucide-react"
import WhatsAppButton from "../../components/WhatsAppButton"

export default function PaymentFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-800">Pago No Completado</CardTitle>
          <CardDescription>Hubo un problema con tu pago</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del error */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">Detalles del Error</h3>
            <div className="space-y-1 text-sm text-red-700">
              {paymentId && (
                <p>
                  <strong>ID de Pago:</strong> {paymentId}
                </p>
              )}
              {status && (
                <p>
                  <strong>Estado:</strong> {status}
                </p>
              )}
              <p>
                <strong>Motivo:</strong> El pago fue rechazado o cancelado
              </p>
            </div>
          </div>

          {/* Posibles causas */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">💡 Posibles Causas</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Fondos insuficientes en la tarjeta</li>
              <li>• Datos de la tarjeta incorrectos</li>
              <li>• Pago cancelado por el usuario</li>
              <li>• Problema temporal del banco</li>
            </ul>
          </div>

          {/* Qué hacer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">🔧 ¿Qué puedes hacer?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verificar los datos de tu tarjeta</li>
              <li>• Intentar con otra tarjeta</li>
              <li>• Contactar a tu banco</li>
              <li>• Intentar el pago más tarde</li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              ¿Necesitas Ayuda?
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Nuestro equipo de soporte puede ayudarte a resolver el problema
            </p>
            <WhatsAppButton
              message={`Hola! Tuve un problema con mi pago. ID: ${paymentId || "N/A"}, Estado: ${status || "N/A"}`}
              className="w-full"
            />
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar Nuevamente
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-gray-600 hover:bg-gray-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
