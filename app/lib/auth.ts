import { supabase } from "../../lib/supabase"

export interface AuthUser {
  id: string
  email: string
  role: "user" | "admin"
  name?: string
  last_name?: string
  dni?: string
  phone?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  last_name: string
  dni: string
  phone?: string
}

// Función para hacer login
export async function signIn({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Obtener perfil del usuario
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError) throw profileError

  return {
    user: data.user,
    profile,
  }
}

// Función para registrarse
export async function signUp({ email, password, name, last_name, dni, phone }: RegisterData) {
  // Verificar que el DNI no esté en uso
  const { data: existingProfile } = await supabase.from("profiles").select("dni").eq("dni", dni).single()

  if (existingProfile) {
    throw new Error("El DNI ya está registrado")
  }

  // Crear usuario en auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (!data.user) {
    throw new Error("Error al crear usuario")
  }

  // Actualizar perfil con datos adicionales
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name,
      last_name,
      dni,
      phone,
    })
    .eq("id", data.user.id)

  if (profileError) throw profileError

  return data
}

// Función para cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Función para obtener usuario actual
export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) return null

  return {
    id: user.id,
    email: user.email!,
    role: profile.role,
    name: profile.name,
    last_name: profile.last_name,
    dni: profile.dni,
    phone: profile.phone,
  }
}

// Función para verificar si es admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}

// Hook para escuchar cambios de autenticación
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}
