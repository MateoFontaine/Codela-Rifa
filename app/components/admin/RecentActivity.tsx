"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, Search, Eye, Download } from "lucide-react"
import { formatCurrency } from "../../lib/utils"

interface RecentActivityProps {
  activitySearch: string
  setActivitySearch: (search: string) => void
  filteredActivities: any[]
  activities: any[]
  onShowActivityModal: () => void
  onExportActivitiesData: () => void
}

export default function RecentActivity({
  activitySearch,
  setActivitySearch,
  filteredActivities,
  activities,
  onShowActivityModal,
  onExportActivitiesData,
}: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>Últimas compras y transacciones registradas</CardDescription>

        {/* Buscador de actividades */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Buscar por nombre o número..."
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.userName}</p>
                  <p className="text-xs text-gray-500">
                    Compró {activity.numbersCount} números • {activity.timestamp}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activity.numbers.slice(0, 3).map((num: number) => (
                      <span key={num} className="bg-sky-100 text-sky-700 text-xs px-1 py-0.5 rounded">
                        {num.toString().padStart(6, "0")}
                      </span>
                    ))}
                    {activity.numbers.length > 3 && (
                      <span className="text-xs text-gray-500">+{activity.numbers.length - 3} más</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-500">{formatCurrency(activity.amount)}</p>
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay actividad reciente</p>
              <p className="text-sm mt-1">Las compras aparecerán aquí automáticamente</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No se encontraron resultados para "{activitySearch}"</p>
            </div>
          )}
        </div>
        <div className="pt-4 flex gap-2">
          <Button
            onClick={onShowActivityModal}
            variant="outline"
            className="flex-1 bg-transparent border-sky-500 text-sky-600 hover:bg-sky-50"
            disabled={activities.length === 0}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver historial ({activities.length})
          </Button>
          <Button
            onClick={onExportActivitiesData}
            variant="outline"
            className="flex-1 bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            disabled={activities.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
