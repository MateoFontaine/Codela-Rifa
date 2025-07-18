"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, User, Calendar } from "lucide-react"
import { RAFFLE_CONFIG, VALIDATION } from "../../lib/constants"
import { formatCurrency, formatNumber, validateNumberRange } from "../lib/utils"

export default function PublicNumberSearch() {
  const [searchNumber, setSearchNumber] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    const num = Number.parseInt(searchNumber)
    if (!num || !validateNumberRange(num)) {
      setError(
        `Ingresa un número válido entre ${VALIDATION.MIN_NUMBER.toLocaleString()} y ${VALIDATION.MAX_NUMBER.toLocaleString()}`,
      )
      return
    }

    setLoading(true)
    setError("")
    setSearchResult(null)

    try {
      const result = await searchNumber(num)
      setSearchResult(result)
    } catch (err) {
      console.error("Error searching number:", err)
      setError("Error al buscar el número")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Search className="w-6 h-6" />
            Consultar Número
          </CardTitle>
          <CardDescription>Verifica si tu número favorito está disponible o ya fue vendido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Buscador */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Ingresa un número (${VALIDATION.MIN_NUMBER}-${VALIDATION.MAX_NUMBER.toLocaleString()})`}
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                min={VALIDATION.MIN_NUMBER}
                max={VALIDATION.MAX_NUMBER}
                className="flex-1 text-center text-lg font-mono"
                disabled={loading}
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !searchNumber}
                className="bg-sky-500 hover:bg-sky-600"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {/* Resultado */}
            {searchResult && (
              <div className="mt-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold font-mono text-gray-800 mb-2">
                    {formatNumber(searchResult.number)}
                  </div>
                </div>

                {searchResult.status === "available" ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">¡Número Disponible!</h3>
                    <p className="text-green-700 mb-4">Este número está disponible para comprar</p>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(searchResult.price)}</p>
                      <p className="text-sm text-gray-600">Precio del número</p>
                    </div>
                    <p className="text-sm text-green-600">Inicia sesión para comprarlo</p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Número No Disponible</h3>
                    <p className="text-red-700 mb-4">Este número ya fue vendido</p>

                    {searchResult.users && (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Comprado por:</span>
                        </div>
                        <p className="font-medium text-gray-800">
                          {searchResult.users.name} {searchResult.users.last_name}
                        </p>
                        {searchResult.purchased_at && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(searchResult.purchased_at).toLocaleDateString("es-AR")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-red-600">Prueba con otro número</p>
                  </div>
                )}
              </div>
            )}

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <h4 className="font-medium text-sky-800 mb-2">ℹ️ Información del Sorteo</h4>
              <div className="text-sm text-sky-700 space-y-1">
                <p>
                  • <strong>Total de números:</strong> {RAFFLE_CONFIG.TOTAL_NUMBERS.toLocaleString()} (del{" "}
                  {formatNumber(VALIDATION.MIN_NUMBER)} al {formatNumber(VALIDATION.MAX_NUMBER)})
                </p>
                <p>
                  • <strong>Precio por número:</strong> {formatCurrency(RAFFLE_CONFIG.PRICE_PER_NUMBER)}
                </p>
                <p>
                  • <strong>Estado:</strong> Rifa activa
                </p>
                <p>
                  • <strong>Premio:</strong> {RAFFLE_CONFIG.PRIZE_DESCRIPTION}
                </p>
                <p>
                  • <strong>Fecha del sorteo:</strong> 31 de Diciembre 2024
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Función simulada - en la implementación real vendría de la base de datos
async function searchNumber(number: number) {
  // Simular búsqueda en base de datos
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simular algunos números vendidos
  const soldNumbers = [1234, 5678, 9012, 12345, 67890, 99999]

  if (soldNumbers.includes(number)) {
    return {
      number,
      status: "sold",
      price: RAFFLE_CONFIG.PRICE_PER_NUMBER,
      purchased_at: new Date().toISOString(),
      users: {
        name: "Juan Carlos",
        last_name: "Pérez",
      },
    }
  }

  return {
    number,
    status: "available",
    price: RAFFLE_CONFIG.PRICE_PER_NUMBER,
  }
}
