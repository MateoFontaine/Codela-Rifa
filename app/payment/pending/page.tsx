"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Home, Mail, MessageCircle } from "lucide-react"
import WhatsAppButton from "../../components/WhatsAppButton"

export default function PaymentPendingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Clock className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl text-yellow-800">Pago Pendiente</CardTitle>
          <CardDescription>Tu pago está siendo procesado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del pago */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Detalles del Pago</h3>
            <div className="space-y-1 text-sm text-yellow-700">
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
                <strong>Motivo:</strong> El pago está siendo verificado
              </p>
            </div>
          </div>

          {/* Información del proceso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">⏳ ¿Qué está pasando?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Tu pago está siendo verificado por el banco</li>
              <li>• Este proceso puede tomar unos minutos</li>
              <li>• Te notificaremos cuando se complete</li>
              <li>• No es necesario realizar otro pago</li>
            </ul>
          </div>

          {/* Próximos pasos */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">📧 Próximos Pasos</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Recibirás un email cuando se confirme</li>
              <li>• Puedes cerrar esta ventana</li>
              <li>• Revisa tu cuenta en unos minutos</li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-orange-800 mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              ¿Tienes Dudas?
            </h3>
            <p className="text-sm text-orange-700 mb-3">Si el pago no se confirma en 30 minutos, contáctanos</p>
            <WhatsAppButton
              message={`Hola! Mi pago está pendiente. ID: ${paymentId || "N/A"}, Estado: ${status || "N/A"}`}
              className="w-full"
            />
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full bg-transparent border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Revisar Mi Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
