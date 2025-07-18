"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, User } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")

  useEffect(() => {
    // Countdown para redirección automática
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleGoToUser = () => {
    // Simular login exitoso y ir a vista de usuario
    const userData = {
      id: 1,
      name: "Usuario",
      last_name: "Ejemplo",
      email: "usuario@ejemplo.com",
      role: "user",
    }

    // En una implementación real, obtendrías los datos del usuario desde la referencia externa
    window.location.href = "/?login=success"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-800">¡Pago Exitoso!</CardTitle>
          <CardDescription>Tu compra ha sido procesada correctamente</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del pago */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Detalles del Pago</h3>
            <div className="space-y-1 text-sm text-green-700">
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
              {externalReference && (
                <p>
                  <strong>Referencia:</strong> {externalReference}
                </p>
              )}
            </div>
          </div>

          {/* Información del proceso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">📧 Próximos Pasos</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Tus números están siendo procesados</li>
              <li>• Recibirás un email de confirmación</li>
              <li>• Los números aparecerán en tu cuenta en unos minutos</li>
            </ul>
          </div>

          {/* Premio */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">🏆 Premio del Sorteo</h3>
            <p className="text-sm text-yellow-700">
              <strong>Camiseta de la Selección Argentina</strong> firmada por todos los jugadores
            </p>
            <p className="text-xs text-yellow-600 mt-1">Sorteo: 31 de Diciembre 2024</p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button onClick={handleGoToUser} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <User className="w-4 h-4 mr-2" />
              Ver Mis Números
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full bg-transparent border-green-600 text-green-600 hover:bg-green-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>

          {/* Redirección automática */}
          <div className="text-center text-sm text-gray-500">
            <p>Redirigiendo automáticamente en {countdown} segundos...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
