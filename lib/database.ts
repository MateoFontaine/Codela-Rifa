import { supabase } from "./supabase"
import { RAFFLE_CONFIG } from "./constants"

// Funciones para usuarios
export async function createUser(userData: {
  name: string
  last_name: string
  email: string
  dni: string
  phone?: string
  password: string
}) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: userData.name,
      last_name: userData.last_name,
      email: userData.email,
      dni: userData.dni,
      phone: userData.phone,
      password: userData.password, // En producción, hashear la contraseña
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function getUserByDNI(dni: string) {
  const { data, error } = await supabase.from("users").select("*").eq("dni", dni).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

// Funciones para números
export async function getAvailableNumbers(limit = 100) {
  const { data, error } = await supabase
    .from("raffle_numbers")
    .select("*")
    .eq("status", "available")
    .eq("raffle_id", 1)
    .limit(limit)
    .order("number")

  if (error) throw error
  return data
}

export async function getNumbersByUser(userId: number) {
  const { data, error } = await supabase
    .from("raffle_numbers")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "sold")
    .order("number")

  if (error) throw error
  return data
}

export async function purchaseNumbers(numbers: number[], userId: number) {
  try {
    const versionPromises = numbers.map(num => 
      supabase
        .from('raffle_numbers')
        .select('version')
        .eq('number', num)
        .single()
    );
    
    const versions = await Promise.all(versionPromises);
    
    const reservePromises = numbers.map((num, index) => 
      supabase.rpc('reserve_number', {
        p_number: num,
        p_user_id: userId,
        p_current_version: versions[index].data?.version
      })
    );

    const results = await Promise.all(reservePromises);
    
    const errors = results.filter(r => r.error);
    if (errors.length > 0) throw errors[0].error;
    
    return results.map(r => r.data);

  } catch (error: any) {
    throw new Error(`Error reserving numbers: ${error.message}`);
  }
}

export async function searchNumber(number: number) {
  const { data, error } = await supabase
    .from("raffle_numbers")
    .select(`
      *,
      users (name, last_name, email)
    `)
    .eq("number", number)
    .single()

  if (error) throw error
  return data
}

// Funciones para transacciones
export async function createTransaction(transactionData: {
  user_id: number
  amount: number
  numbers: number[]
  status?: string
}) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...transactionData,
      raffle_id: 1, // Por ahora solo tenemos una rifa
      status: transactionData.status || "completed",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Funciones para estadísticas (Admin) - VERSIÓN REAL CON CONSTANTES CORRECTAS
export async function getRaffleStats() {
  console.log("🔍 Obteniendo estadísticas REALES de la rifa...")

  try {
    // Obtener conteo directo de números vendidos
    const { count: soldCount, error: soldError } = await supabase
      .from("raffle_numbers")
      .select("*", { count: "exact", head: true })
      .eq("raffle_id", 1)
      .eq("status", "sold")

    if (soldError) {
      console.error("❌ Error obteniendo números vendidos:", soldError)
      throw soldError
    }

    console.log("🔢 Números vendidos (REAL):", soldCount || 0)

    // Obtener conteo directo de números disponibles
    const { count: availableCount, error: availableError } = await supabase
      .from("raffle_numbers")
      .select("*", { count: "exact", head: true })
      .eq("raffle_id", 1)
      .eq("status", "available")

    if (availableError) {
      console.error("❌ Error obteniendo números disponibles:", availableError)
      throw availableError
    }

    console.log("🔢 Números disponibles (REAL):", availableCount || 0)

    // Obtener total de usuarios REALES
    const { count: totalUsers, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (userError) {
      console.error("❌ Error obteniendo usuarios:", userError)
      throw userError
    }

    console.log("👥 Total usuarios (REAL):", totalUsers || 0)

    // Obtener ingresos totales REALES de transacciones completadas
    const { data: transactions, error: transactionError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("status", "completed")
      .eq("raffle_id", 1)

    if (transactionError) {
      console.error("❌ Error obteniendo transacciones:", transactionError)
      throw transactionError
    }

    console.log("💰 Transacciones REALES encontradas:", transactions?.length || 0)

    const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

    console.log("💰 Ingresos totales (REAL):", totalRevenue)

    const soldNumbers = soldCount || 0
    const availableNumbers = availableCount || 0
    const totalNumbers = RAFFLE_CONFIG.TOTAL_NUMBERS // ✅ Usar constante correcta

    const stats = {
      totalNumbers,
      soldNumbers,
      availableNumbers,
      totalRevenue,
      totalUsers: totalUsers || 0,
    }

    console.log("📈 Estadísticas REALES finales:", stats)

    return stats
  } catch (error) {
    console.error("❌ Error general en getRaffleStats:", error)
    // Retornar valores por defecto en caso de error usando constantes
    return {
      totalNumbers: RAFFLE_CONFIG.TOTAL_NUMBERS,
      soldNumbers: 0,
      availableNumbers: RAFFLE_CONFIG.TOTAL_NUMBERS,
      totalRevenue: 0,
      totalUsers: 0,
    }
  }
}

export async function getAllUsers() {
  console.log("👥 Obteniendo usuarios REALES...")

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("❌ Error obteniendo usuarios:", error)
    throw error
  }

  console.log("👥 Usuarios REALES encontrados:", data?.length || 0)

  // Calcular estadísticas por usuario
  return Promise.all(
    data.map(async (user) => {
      const { data: userNumbers } = await supabase
        .from("raffle_numbers")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "sold")

      const { data: userTransactions } = await supabase
        .from("transactions")
        .select("amount, created_at")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })

      const totalSpent = userTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
      const lastPurchase = userTransactions?.[0]?.created_at || user.created_at

      return {
        ...user,
        numbersCount: userNumbers?.length || 0,
        totalSpent,
        lastPurchase: new Date(lastPurchase).toLocaleString("es-AR"),
      }
    }),
  )
}

export async function getRecentActivity() {
  console.log("📊 Obteniendo actividad REAL...")

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      users (name, last_name)
    `)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("❌ Error obteniendo actividad:", error)
    throw error
  }

  console.log("📊 Actividades REALES encontradas:", data?.length || 0)

  return data.map((transaction) => ({
    id: transaction.id,
    userName: `${transaction.users.name} ${transaction.users.last_name}`,
    type: "purchase" as const,
    amount: Number(transaction.amount),
    numbersCount: transaction.numbers.length,
    timestamp: new Date(transaction.created_at).toLocaleString("es-AR"),
    numbers: transaction.numbers,
  }))
}
