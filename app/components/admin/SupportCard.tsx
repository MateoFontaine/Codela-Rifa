"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageCircle } from "lucide-react"
import { RAFFLE_CONFIG } from "../../../lib/constants"
import WhatsAppButton from "../WhatsAppButton"

export default function SupportCard() {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <HelpCircle className="w-5 h-5 mr-2" />
          Soporte Técnico
        </CardTitle>
        <CardDescription className="text-green-700">Contacto directo para administradores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Soporte Prioritario
            </h4>
            <ul className="text-sm text-green-700 space-y-1 mb-3">
              <li>• Problemas técnicos del sistema</li>
              <li>• Consultas sobre pagos</li>
              <li>• Configuración de la rifa</li>
              <li>• Reportes y estadísticas</li>
            </ul>
            <WhatsAppButton
              message={`Hola! Soy el administrador de la ${RAFFLE_CONFIG.RAFFLE_NAME} y necesito soporte técnico urgente`}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
