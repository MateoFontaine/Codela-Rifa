"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, Loader2, CheckCircle, Mail } from "lucide-react"
import { signIn, signUp } from "../lib/auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    last_name: "",
    dni: "",
    phone: "",
  })

  if (!isOpen) return null

  const resetForm = () => {
    setError("")
    setSuccess("")
    setNeedsConfirmation(false)
    setLoginData({ email: "", password: "" })
    setRegisterData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      last_name: "",
      dni: "",
      phone: "",
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNeedsConfirmation(false)

    try {
      const result = await signIn(loginData)
      setSuccess("¡Inicio de sesión exitoso!")

      // Pequeña pausa para mostrar el mensaje de éxito
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 1000)
    } catch (err: any) {
      console.error("Login error:", err)

      const errorMessage = err?.message || err?.error_description || String(err)

      if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("invalid_credentials")) {
        setError("Email o contraseña incorrectos")
      } else if (errorMessage.includes("Email not confirmed") || errorMessage.includes("email_not_confirmed")) {
        setNeedsConfirmation(true)
        setError("Tu cuenta necesita confirmación por email. Revisa tu bandeja de entrada.")
      } else if (errorMessage.includes("Invalid email")) {
        setError("El formato del email no es válido")
      } else if (errorMessage.includes("signup_disabled")) {
        setError("El registro está temporalmente deshabilitado")
      } else {
        setError(errorMessage || "Error al iniciar sesión")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNeedsConfirmation(false)

    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (registerData.dni.length < 7) {
      setError("El DNI debe tener al menos 7 dígitos")
      setLoading(false)
      return
    }

    try {
      const result = await signUp({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
        last_name: registerData.last_name,
        dni: registerData.dni,
        phone: registerData.phone,
      })

      // Si el registro fue exitoso pero necesita confirmación
      if (result.user && !result.user.email_confirmed_at) {
        setNeedsConfirmation(true)
        setSuccess("¡Registro exitoso! Revisa tu email para confirmar tu cuenta antes de iniciar sesión.")
      } else {
        setSuccess("¡Registro exitoso! Ya puedes iniciar sesión.")
      }

      // Cambiar a modo login después del registro exitoso
      setTimeout(() => {
        setMode("login")
        setLoginData({ email: registerData.email, password: "" })
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          last_name: "",
          dni: "",
          phone: "",
        })
        setSuccess("")
        setNeedsConfirmation(false)
      }, 3000)
    } catch (err: any) {
      console.error("Registration error:", err)

      const errorMessage = err?.message || err?.error_description || String(err)

      if (errorMessage.includes("already registered") || errorMessage.includes("User already registered")) {
        setError("Este email ya está registrado")
      } else if (errorMessage.includes("DNI ya está registrado")) {
        setError("Este DNI ya está registrado")
      } else if (errorMessage.includes("duplicate key value")) {
        setError("Este email o DNI ya está registrado")
      } else if (errorMessage.includes("Invalid email")) {
        setError("El formato del email no es válido")
      } else if (errorMessage.includes("Password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres")
      } else {
        setError(errorMessage || "Error al registrarse")
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError("")
    setSuccess("")
    setNeedsConfirmation(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                {success && <CheckCircle className="w-5 h-5 text-green-500" />}
                {needsConfirmation && <Mail className="w-5 h-5 text-blue-500" />}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Accede a tu cuenta para participar en la rifa"
                  : "Crea tu cuenta para participar en la rifa"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
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

          {needsConfirmation && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <div>
                <p className="font-medium">Confirmación requerida</p>
                <p className="text-xs mt-1">
                  Revisa tu email y haz clic en el enlace de confirmación. Luego podrás iniciar sesión.
                </p>
              </div>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    disabled={loading}
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
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    placeholder="Juan"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={registerData.last_name}
                    onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                    required
                    placeholder="Pérez"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  value={registerData.dni}
                  onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value.replace(/\D/g, "") })}
                  required
                  placeholder="12345678"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="11-1234-5678"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    disabled={loading}
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

              <div>
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                />
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

          {/* Credenciales de prueba para admin */}
          <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-sky-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">🔑 Credenciales de Prueba:</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <strong>Admin:</strong> admin@rifa.com / admin123
              </p>
              <p className="text-xs text-gray-600">
                <strong>Usuario:</strong> Regístrate con tu email
              </p>
            </div>
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
              <strong>Nota:</strong> Si tienes problemas con confirmación de email, ejecuta el script SQL para
              deshabilitarla.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
