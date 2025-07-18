"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, LogOut, RefreshCw } from "lucide-react"
import { formatCurrency } from "../lib/utils"
import { getRaffleStats, getAllUsers, getRecentActivity } from "../../lib/database"
import { RAFFLE_CONFIG } from "../../lib/constants"
import { supabase } from "../../lib/supabase"

// Componentes
import DatabaseStatus from "./admin/DatabaseStatus"
import ProgressCard from "./admin/ProgressCard"
import SupportCard from "./admin/SupportCard"
import UsersManagement from "./admin/UsersManagement"
import RecentActivity from "./admin/RecentActivity"

interface AdminViewProps {
  onBack: () => void
  currentUser: any
}

export default function AdminView({ onBack, currentUser }: AdminViewProps) {
  const [stats, setStats] = useState({
    totalNumbers: RAFFLE_CONFIG.TOTAL_NUMBERS,
    soldNumbers: 0,
    availableNumbers: RAFFLE_CONFIG.TOTAL_NUMBERS,
    totalRevenue: 0,
    totalUsers: 0,
  })

  const [users, setUsers] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activitySearch, setActivitySearch] = useState("")
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])

  // Estado para verificar conexión a la base de datos
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{
    connected: boolean
    tablesExist: boolean
    hasData: boolean
    error?: string
  }>({
    connected: false,
    tablesExist: false,
    hasData: false,
  })

  useEffect(() => {
    checkDatabaseConnection()
    loadData()

    // Auto-refresh cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Función para verificar conexión a la base de datos
  const checkDatabaseConnection = async () => {
    console.log("🔍 Verificando conexión a la base de datos...")

    try {
      // 1. Verificar conexión básica
      const { data: connectionTest, error: connectionError } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true })

      if (connectionError) {
        console.error("❌ Error de conexión:", connectionError)
        setDbConnectionStatus({
          connected: false,
          tablesExist: false,
          hasData: false,
          error: connectionError.message,
        })
        return
      }

      console.log("✅ Conexión a Supabase exitosa")

      // 2. Verificar que las tablas existan
      const { data: usersCheck } = await supabase.from("users").select("id").limit(1)
      const { data: raffleNumbersCheck } = await supabase.from("raffle_numbers").select("id").limit(1)
      const { data: transactionsCheck } = await supabase.from("transactions").select("id").limit(1)

      const tablesExist = usersCheck !== null && raffleNumbersCheck !== null && transactionsCheck !== null

      console.log("📋 Tablas verificadas:", {
        usersCheck: !!usersCheck,
        raffleNumbersCheck: !!raffleNumbersCheck,
        transactionsCheck: !!transactionsCheck,
      })

      // 3. Verificar si hay datos
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })
      const { count: numbersCount } = await supabase.from("raffle_numbers").select("*", { count: "exact", head: true })

      const hasData = (usersCount || 0) > 0 || (numbersCount || 0) > 0

      console.log("📊 Datos encontrados:", { usersCount, numbersCount, hasData })

      setDbConnectionStatus({
        connected: true,
        tablesExist,
        hasData,
      })

      console.log("✅ Estado de la base de datos:", {
        connected: true,
        tablesExist,
        hasData,
        usersCount,
        numbersCount,
      })
    } catch (error) {
      console.error("❌ Error verificando base de datos:", error)
      setDbConnectionStatus({
        connected: false,
        tablesExist: false,
        hasData: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    }
  }

  // Filtrar actividades por búsqueda
  useEffect(() => {
    if (!activitySearch.trim()) {
      setFilteredActivities(activities)
    } else {
      const searchTerm = activitySearch.toLowerCase()
      const filtered = activities.filter((activity) => {
        const nameMatch = activity.userName.toLowerCase().includes(searchTerm)
        const numberMatch = activity.numbers.some((num: number) => num.toString().includes(searchTerm))
        return nameMatch || numberMatch
      })
      setFilteredActivities(filtered)
    }
  }, [activitySearch, activities])

  // Filtrar usuarios por búsqueda
  useEffect(() => {
    if (!userSearch.trim()) {
      setFilteredUsers(users)
    } else {
      const searchTerm = userSearch.toLowerCase()
      const filtered = users.filter((user) => {
        const nameMatch = user.name.toLowerCase().includes(searchTerm)
        const lastNameMatch = user.last_name.toLowerCase().includes(searchTerm)
        const dniMatch = user.dni.includes(searchTerm)
        const emailMatch = user.email.toLowerCase().includes(searchTerm)
        return nameMatch || lastNameMatch || dniMatch || emailMatch
      })
      setFilteredUsers(filtered)
    }
  }, [userSearch, users])

  const loadData = async () => {
    try {
      const isInitialLoad = loading
      if (!isInitialLoad) setRefreshing(true)

      console.log("🔄 Cargando datos del admin...")

      const [statsData, usersData, activitiesData] = await Promise.all([
        getRaffleStats(),
        getAllUsers(),
        getRecentActivity(),
      ])

      console.log("📊 Datos cargados:", {
        stats: statsData,
        users: usersData.length,
        activities: activitiesData.length,
      })

      setStats(statsData)
      setUsers(usersData)
      setActivities(activitiesData)
      setFilteredActivities(activitiesData)
      setFilteredUsers(usersData)
    } catch (error) {
      console.error("❌ Error loading admin data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    await checkDatabaseConnection()
    await loadData()
  }

  const exportUsersData = () => {
    const csvHeaders =
      "Nombre,Apellido,DNI,Email,Teléfono,Números Comprados,Total Gastado,Última Compra,Fecha Registro\n"
    const csvData = users
      .map((user) => {
        return `"${user.name}","${user.last_name}","${user.dni}","${user.email}","${user.phone || "N/A"}",${user.numbersCount},${user.totalSpent},"${user.lastPurchase}","${new Date(user.created_at).toLocaleString("es-AR")}"`
      })
      .join("\n")

    const BOM = "\uFEFF"
    const csvContent = BOM + csvHeaders + csvData

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Usuarios_Rifa_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportActivitiesData = () => {
    const csvHeaders = "Usuario,Fecha y Hora,Cantidad Números,Monto,Números Comprados\n"
    const csvData = activities
      .map(
        (activity) =>
          `"${activity.userName}","${activity.timestamp}",${activity.numbersCount},"${formatCurrency(activity.amount)}","${activity.numbers.join(", ")}"`,
      )
      .join("\n")

    const csvContent = csvHeaders + csvData

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `actividades_rifa_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUserSelect = (user: any) => {
    // Aquí puedes implementar la lógica para mostrar el modal de detalle de usuario
    console.log("Usuario seleccionado:", user)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-rose-600" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {currentUser?.name} {currentUser?.last_name}
                  </h1>
                  <p className="text-sm text-rose-600 font-medium">Administrador</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-sm font-semibold text-gray-900">Admin</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRefresh} size="sm" disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 sm:mr-2 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{refreshing ? "Actualizando..." : "Actualizar"}</span>
              </Button>
              <Button variant="outline" onClick={onBack} size="sm">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Estado de la Base de Datos */}
        <DatabaseStatus dbConnectionStatus={dbConnectionStatus} />

        {/* Debug info */}
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm">
          <p className="font-bold mb-2">🔍 Información de Debug (Datos REALES de Supabase):</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Números vendidos:</strong> {stats.soldNumbers.toLocaleString()}
              </p>
              <p>
                <strong>Números disponibles:</strong> {stats.availableNumbers.toLocaleString()}
              </p>
              <p>
                <strong>Total números:</strong> {stats.totalNumbers.toLocaleString()} ✅
              </p>
            </div>
            <div>
              <p>
                <strong>Ingresos totales:</strong> {formatCurrency(stats.totalRevenue)}
              </p>
              <p>
                <strong>Total usuarios:</strong> {stats.totalUsers}
              </p>
              <p>
                <strong>Actividades:</strong> {activities.length}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <p className="text-xs text-gray-600">
              ✅ Configuración: {RAFFLE_CONFIG.RAFFLE_NAME} - {stats.totalNumbers.toLocaleString()} números totales
              {dbConnectionStatus.connected ? " ✅ Conexión OK" : " ❌ Sin conexión"}
            </p>
          </div>
        </div>

        {/* Sección principal - Progreso de ventas y Soporte */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <ProgressCard stats={stats} users={users} />
          <SupportCard />
        </div>

        {/* Gestión de usuarios */}
        <UsersManagement
          stats={stats}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          filteredUsers={filteredUsers}
          onShowUsersModal={() => console.log("Mostrar modal de usuarios")}
          onExportUsersData={exportUsersData}
          onUserSelect={handleUserSelect}
        />

        {/* Actividad reciente */}
        <RecentActivity
          activitySearch={activitySearch}
          setActivitySearch={setActivitySearch}
          filteredActivities={filteredActivities}
          activities={activities}
          onShowActivityModal={() => console.log("Mostrar modal de actividades")}
          onExportActivitiesData={exportActivitiesData}
        />
      </div>
    </div>
  )
}
