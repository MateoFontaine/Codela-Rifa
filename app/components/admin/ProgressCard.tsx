"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { formatCurrency } from "../../lib/utils"
import { RAFFLE_CONFIG } from "../../../lib/constants"

interface ProgressCardProps {
  stats: {
    totalNumbers: number
    soldNumbers: number
    availableNumbers: number
    totalRevenue: number
    totalUsers: number
  }
  users: any[]
}

export default function ProgressCard({ stats, users }: ProgressCardProps) {
  const progressPercentage = (stats.soldNumbers / stats.totalNumbers) * 100

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <BarChart3 className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="break-words">Progreso de la {RAFFLE_CONFIG.RAFFLE_NAME}</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Meta: Vender todos los {stats.totalNumbers.toLocaleString()} números disponibles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Barra de progreso principal */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm sm:text-lg font-semibold text-gray-700">Progreso General</span>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">{progressPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-sky-400 to-sky-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(progressPercentage, 2)}%` }}
              >
                {progressPercentage > 5 && (
                  <span className="text-white text-xs font-medium">{progressPercentage.toFixed(1)}%</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
              <span>0 números</span>
              <span>{stats.totalNumbers.toLocaleString()} números</span>
            </div>
          </div>

          {/* Estadísticas en grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-rose-50 p-3 sm:p-4 rounded-lg text-center">
              <p className="text-rose-600 font-medium text-xs sm:text-sm">Números Vendidos</p>
              <p className="text-lg sm:text-2xl font-bold text-rose-700">{stats.soldNumbers.toLocaleString()}</p>
              <p className="text-xs text-rose-500 mt-1">
                {((stats.soldNumbers / stats.totalNumbers) * 100).toFixed(1)}% del total
              </p>
            </div>
            <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg text-center">
              <p className="text-emerald-600 font-medium text-xs sm:text-sm">Números Disponibles</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-700">
                {stats.availableNumbers.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-500 mt-1">
                {((stats.availableNumbers / stats.totalNumbers) * 100).toFixed(1)}% restante
              </p>
            </div>
            <div className="bg-sky-50 p-3 sm:p-4 rounded-lg text-center">
              <p className="text-sky-600 font-medium text-xs sm:text-sm">Ingresos Totales</p>
              <p className="text-lg sm:text-2xl font-bold text-sky-700">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-sky-500 mt-1">
                {stats.soldNumbers > 0
                  ? `${formatCurrency(stats.totalRevenue / stats.soldNumbers)} promedio`
                  : "Esperando ventas"}
              </p>
            </div>
            <div className="bg-violet-50 p-3 sm:p-4 rounded-lg text-center">
              <p className="text-violet-600 font-medium text-xs sm:text-sm">Total Usuarios</p>
              <p className="text-lg sm:text-2xl font-bold text-violet-700">{stats.totalUsers}</p>
              <p className="text-xs text-violet-500 mt-1">
                {users.filter((u) => u.numbersCount > 0).length} con compras
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
              <span>Última actualización: {new Date().toLocaleTimeString("es-AR")}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Auto-actualización cada 30s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
