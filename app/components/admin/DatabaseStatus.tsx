"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface DatabaseStatusProps {
  dbConnectionStatus: {
    connected: boolean
    tablesExist: boolean
    hasData: boolean
    error?: string
  }
}

export default function DatabaseStatus({ dbConnectionStatus }: DatabaseStatusProps) {
  return (
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Estado de la Base de Datos
        </CardTitle>
        <CardDescription>Verificación de conexión y datos en tiempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conexión */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            {dbConnectionStatus.connected ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <p className="font-medium text-sm">Conexión a Supabase</p>
              <p className={`text-xs ${dbConnectionStatus.connected ? "text-green-600" : "text-red-600"}`}>
                {dbConnectionStatus.connected ? "✅ Conectado" : "❌ Desconectado"}
              </p>
            </div>
          </div>

          {/* Tablas */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            {dbConnectionStatus.tablesExist ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            )}
            <div>
              <p className="font-medium text-sm">Tablas de la BD</p>
              <p className={`text-xs ${dbConnectionStatus.tablesExist ? "text-green-600" : "text-yellow-600"}`}>
                {dbConnectionStatus.tablesExist ? "✅ Creadas" : "⚠️ Verificando"}
              </p>
            </div>
          </div>

          {/* Datos */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            {dbConnectionStatus.hasData ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            )}
            <div>
              <p className="font-medium text-sm">Datos Reales</p>
              <p className={`text-xs ${dbConnectionStatus.hasData ? "text-green-600" : "text-yellow-600"}`}>
                {dbConnectionStatus.hasData ? "✅ Con datos" : "⚠️ Sin datos"}
              </p>
            </div>
          </div>
        </div>

        {/* Error o información adicional */}
        {dbConnectionStatus.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {dbConnectionStatus.error}
            </p>
          </div>
        )}

        {!dbConnectionStatus.hasData && dbConnectionStatus.connected && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>Nota:</strong> La base de datos está conectada pero no tiene datos. Ejecuta los scripts SQL para
              agregar datos de prueba.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
