"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2, CheckCircle, User } from "lucide-react"

interface RegisterModalProps {
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
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [userData, setUserData] = useState<UserData>({
    name: "",
    last_name: "",
    email: "",
    dni: "",
    phone: "",
  })

  if (!isOpen) return null

  const resetForm = () => {
    setError("")
    setSuccess("")
    setUserData({
      name: "",
      last_name: "",
      email: "",
      dni: "",
      phone: "",
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
    // Formato argentino: puede ser 11-1234-5678, 1112345678, etc.
    const phoneRegex = /^[\d\-\s+$$$$]{10,15}$/
    return phoneRegex.test(phone)
  }

  const checkUniqueData = async (email: string, dni: string) => {
    // Simular verificación de datos únicos
    // En una implementación real, esto consultaría la base de datos

    // Simular algunos emails y DNIs ya registrados
    const existingEmails = ["test@test.com", "admin@rifa.com", "usuario@ejemplo.com"]
    const existingDNIs = ["12345678", "87654321", "11111111"]

    if (existingEmails.includes(email.toLowerCase())) {
      throw new Error("Este email ya está registrado")
    }

    if (existingDNIs.includes(dni)) {
      throw new Error("Este DNI ya está registrado")
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validaciones
      if (!userData.name.trim() || !userData.last_name.trim()) {
        throw new Error("Nombre y apellido son obligatorios")
      }

      if (!validateEmail(userData.email)) {
        throw new Error("El formato del email no es válido")
      }

      if (!validateDNI(userData.dni)) {
        throw new Error("El DNI debe tener entre 7 y 8 dígitos")
      }

      if (!userData.phone.trim()) {
        throw new Error("El número de teléfono es obligatorio")
      }

      if (!validatePhone(userData.phone)) {
        throw new Error("El formato del teléfono no es válido")
      }

      // Verificar datos únicos
      await checkUniqueData(userData.email, userData.dni)

      // Simular guardado en base de datos
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("¡Registro exitoso! Bienvenido a la rifa.")

      // Crear objeto de usuario completo
      const completeUserData = {
        ...userData,
        id: Date.now(), // ID temporal
        created_at: new Date().toISOString(),
        totalSpent: 0,
        numbersCount: 0,
      }

      setTimeout(() => {
        onSuccess(completeUserData)
        handleClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Registro de Usuario
                {success && <CheckCircle className="w-5 h-5 text-green-500" />}
              </CardTitle>
              <CardDescription>Completa tus datos para participar en la rifa</CardDescription>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Juan"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Apellido *</Label>
                <Input
                  id="last_name"
                  value={userData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  required
                  placeholder="Pérez"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                placeholder="juan@email.com"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Debe ser único e irrepetible</p>
            </div>

            <div>
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                value={userData.dni}
                onChange={(e) => handleInputChange("dni", e.target.value.replace(/\D/g, ""))}
                required
                placeholder="12345678"
                disabled={loading}
                maxLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Debe ser único e irrepetible (7-8 dígitos)</p>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                placeholder="11-1234-5678"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Número obligatorio para contacto</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600"
              disabled={loading || success}
              size="lg"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {success ? "¡Registrado!" : "Registrarse"}
            </Button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
            <p className="text-sm font-medium text-sky-700 mb-2">📋 Datos requeridos:</p>
            <ul className="text-xs text-sky-600 space-y-1">
              <li>
                • <strong>Email único:</strong> No puede repetirse
              </li>
              <li>
                • <strong>DNI único:</strong> No puede repetirse
              </li>
              <li>
                • <strong>Teléfono obligatorio:</strong> Para contacto
              </li>
              <li>
                • <strong>Todos los campos son requeridos</strong>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
