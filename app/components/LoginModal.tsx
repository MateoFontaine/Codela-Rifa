"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, Loader2, CheckCircle, User, LogIn } from "lucide-react"
import { createUser, getUserByEmail, getUserByDNI } from "../../lib/database"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (userData: any) => void
}

interface UserData {
  name: string
  last_name: string
  email: string
  dni: string
  phone: string
  password: string
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState<UserData>({
    name: "",
    last_name: "",
    email: "",
    dni: "",
    phone: "",
    password: "",
  })

  // Controlar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body de múltiples maneras
      document.body.classList.add("modal-open")
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = "0"
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.bottom = "0"
      document.documentElement.style.overflow = "hidden"
    } else {
      // Restaurar scroll
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.bottom = ""
      document.documentElement.style.overflow = ""
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.bottom = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const resetForm = () => {
    setError("")
    setSuccess("")
    setLoginData({ email: "", password: "" })
    setRegisterData({
      name: "",
      last_name: "",
      email: "",
      dni: "",
      phone: "",
      password: "",
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateDNI = (dni: string) => {
    return dni.length >= 7 && dni.length <= 8 && /^\d+$/.test(dni)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\-\s+()]{10,15}$/
    return phoneRegex.test(phone)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Verificar credenciales de admin
      if (loginData.email === "admin@rifa.com" && loginData.password === "admin123") {
        const adminUser = {
          id: "admin",
          name: "Administrador",
          last_name: "Sistema",
          email: "admin@rifa.com",
          role: "admin",
        }

        setSuccess("¡Bienvenido Administrador!")
        setTimeout(() => {
          onSuccess(adminUser)
          handleClose()
        }, 1000)
        return
      }

      // Buscar usuario en la base de datos
      const user = await getUserByEmail(loginData.email)

      if (!user) {
        setError("Usuario no encontrado")
        setLoading(false)
        return
      }

      // Verificar contraseña (en una implementación real usarías hash)
      if (user.password !== loginData.password) {
        setError("Contraseña incorrecta")
        setLoading(false)
        return
      }

      setSuccess("¡Inicio de sesión exitoso!")
      setTimeout(() => {
        onSuccess({
          ...user,
          role: "user",
        })
        handleClose()
      }, 1000)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validaciones
      if (!registerData.name.trim() || !registerData.last_name.trim()) {
        throw new Error("Nombre y apellido son obligatorios")
      }

      if (!validateEmail(registerData.email)) {
        throw new Error("El formato del email no es válido")
      }

      if (!validateDNI(registerData.dni)) {
        throw new Error("El DNI debe tener entre 7 y 8 dígitos")
      }

      if (!registerData.phone.trim()) {
        throw new Error("El número de teléfono es obligatorio")
      }

      if (!validatePhone(registerData.phone)) {
        throw new Error("El formato del teléfono no es válido")
      }

      if (registerData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      // Verificar que email no exista
      const existingUserByEmail = await getUserByEmail(registerData.email)
      if (existingUserByEmail) {
        throw new Error("Este email ya está registrado")
      }

      // Verificar que DNI no exista
      const existingUserByDNI = await getUserByDNI(registerData.dni)
      if (existingUserByDNI) {
        throw new Error("Este DNI ya está registrado")
      }

      // Crear usuario en la base de datos
      const newUser = await createUser({
        name: registerData.name,
        last_name: registerData.last_name,
        email: registerData.email,
        dni: registerData.dni,
        phone: registerData.phone,
        password: registerData.password, // En producción, hashear la contraseña
      })

      setSuccess("¡Registro exitoso! Cambiando a modo login...")

      setTimeout(() => {
        setMode("login")
        setLoginData({ email: registerData.email, password: "" })
        resetForm()
      }, 2000)
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError("")
    setSuccess("")
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {mode === "login" ? <LogIn className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                {success && <CheckCircle className="w-5 h-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Ingresa tus credenciales para acceder"
                  : "Crea tu cuenta para participar en la rifa"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  placeholder="Escribe tu email"
                  className="placeholder:text-gray-300 w-full [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900 [&:-webkit-autofill]:!border-gray-300"
                  disabled={loading}
                  autoComplete="username"
                  style={{
                    WebkitBoxShadow: "inset 0 0 0px 1000px white",
                    WebkitTextFillColor: "#111827",
                  }}
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    placeholder="Ingresa tu contraseña"
                    className="placeholder:text-gray-300 w-full pr-10 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900"
                    disabled={loading}
                    autoComplete="current-password"
                    style={{
                      WebkitBoxShadow: "inset 0 0 0px 1000px white",
                      WebkitTextFillColor: "#111827",
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={loading || success}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {success ? "¡Éxito!" : "Iniciar Sesión"}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" onClick={switchMode} className="text-sky-600" disabled={loading}>
                  ¿No tienes cuenta? Regístrate aquí
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </Label>
                  <Input
                    id="name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    placeholder="Juan"
                    className="placeholder:text-gray-300 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900"
                    disabled={loading}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </Label>
                  <Input
                    id="last_name"
                    value={registerData.last_name}
                    onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                    required
                    placeholder="Pérez"
                    className="placeholder:text-gray-300 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900"
                    disabled={loading}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  placeholder="Escribe tu email"
                  className="placeholder:text-gray-300 w-full [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900 [&:-webkit-autofill]:!border-gray-300"
                  disabled={loading}
                  autoComplete="email"
                  style={{
                    WebkitBoxShadow: "inset 0 0 0px 1000px white",
                    WebkitTextFillColor: "#111827",
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Debe ser único e irrepetible</p>
              </div>

              <div>
                <Label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                  DNI *
                </Label>
                <Input
                  id="dni"
                  value={registerData.dni}
                  onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value.replace(/\D/g, "") })}
                  required
                  placeholder="12345678"
                  className="placeholder:text-gray-300 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900"
                  disabled={loading}
                  maxLength={8}
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">Debe ser único e irrepetible (7-8 dígitos)</p>
              </div>

              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </Label>
                <Input
                  id="phone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                  placeholder="11-1234-5678"
                  className="placeholder:text-gray-300 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900"
                  disabled={loading}
                  autoComplete="tel"
                />
                <p className="text-xs text-gray-500 mt-1">Número obligatorio para contacto</p>
              </div>

              <div>
                <Label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    placeholder="Crea una contraseña"
                    className="placeholder:text-gray-300 w-full pr-10 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:!text-gray-900"
                    disabled={loading}
                    autoComplete="new-password"
                    style={{
                      WebkitBoxShadow: "inset 0 0 0px 1000px white",
                      WebkitTextFillColor: "#111827",
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={loading || success}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {success ? "¡Registro Exitoso!" : "Crear Cuenta"}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" onClick={switchMode} className="text-sky-600" disabled={loading}>
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
