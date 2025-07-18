"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Search, Eye, Download } from "lucide-react"
import { formatCurrency } from "../../lib/utils"

interface UsersManagementProps {
  stats: { totalUsers: number }
  userSearch: string
  setUserSearch: (search: string) => void
  filteredUsers: any[]
  onShowUsersModal: () => void
  onExportUsersData: () => void
  onUserSelect: (user: any) => void
}

export default function UsersManagement({
  stats,
  userSearch,
  setUserSearch,
  filteredUsers,
  onShowUsersModal,
  onExportUsersData,
  onUserSelect,
}: UsersManagementProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Gestión de Usuarios
        </CardTitle>
        <CardDescription>Información de participantes registrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Buscador de usuarios */}
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Buscar por nombre, DNI o email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Vista previa de usuarios filtrados */}
          {userSearch && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {filteredUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onUserSelect(user)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">
                        {user.name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-sky-500">{user.numbersCount} números</p>
                      <p className="text-xs text-emerald-500">{formatCurrency(user.totalSpent)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{filteredUsers.length - 3} usuarios más. Haz clic en "Ver todos" para ver la lista completa.
                </p>
              )}
              {filteredUsers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No se encontraron usuarios para "{userSearch}"</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Button onClick={onShowUsersModal} className="w-full bg-sky-500 hover:bg-sky-600">
              <Eye className="w-4 h-4 mr-2" />
              Ver todos los usuarios ({stats.totalUsers})
            </Button>
            <Button
              onClick={onExportUsersData}
              variant="outline"
              className="w-full bg-transparent border-sky-500 text-sky-600 hover:bg-sky-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar datos de usuarios
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
