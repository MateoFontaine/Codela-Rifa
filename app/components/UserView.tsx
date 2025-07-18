"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Shuffle,
  DollarSign,
  Hash,
  X,
  ShoppingCart,
  Eye,
  RefreshCw,
  User,
  LogOut,
  Menu,
  Home,
  MessageCircle,
  HelpCircle,
  Plus,
} from "lucide-react"
import NumberGrid from "./NumberGrid"
import { generateRandomNumbers, formatCurrency } from "../lib/utils"
import { getNumbersByUser, purchaseNumbers, createTransaction, getAvailableNumbers } from "../../lib/database"
import PaymentModal from "./PaymentModal"
import WhatsAppButton from "./WhatsAppButton"
import { supabase } from "../../lib/supabase"

interface UserViewProps {
  onBack: () => void
  currentUser: any
}

export default function UserView({ onBack, currentUser }: UserViewProps) {
  const [myNumbers, setMyNumbers] = useState<number[]>([])
  const [totalInvested, setTotalInvested] = useState(0)
  const [searchNumber, setSearchNumber] = useState("")
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([])
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [showMyNumbersModal, setShowMyNumbersModal] = useState(false)
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null)
  const [showCartModal, setShowCartModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"numbers" | "info">("numbers")
  const [showSidebar, setShowSidebar] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreNumbers, setHasMoreNumbers] = useState(true)

  const PRICE_PER_NUMBER = 1000
  const NUMBERS_PER_PAGE = 200

  useEffect(() => {
    loadUserData()
    loadAvailableNumbers()
  }, [currentUser])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (showCartModal || showMyNumbersModal || showSidebar) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showCartModal, showMyNumbersModal, showSidebar])

  const loadUserData = async () => {
    try {
      if (currentUser?.id) {
        const userNumbers = await getNumbersByUser(currentUser.id)
        const numbers = userNumbers.map((n) => n.number)
        setMyNumbers(numbers)
        setTotalInvested(numbers.length * PRICE_PER_NUMBER)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const loadAvailableNumbers = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true)
        setCurrentPage(1)
      } else {
        setLoadingMore(true)
      }

      // Cargar números disponibles - ahora carga más para tener un pool más grande
      const available = await getAvailableNumbers(reset ? NUMBERS_PER_PAGE * 3 : NUMBERS_PER_PAGE * 2)
      const availableNums = available.map((n) => n.number)

      if (reset) {
        setAvailableNumbers(availableNums)
        const shuffled = [...availableNums].sort(() => Math.random() - 0.5)
        setDisplayNumbers(shuffled.slice(0, NUMBERS_PER_PAGE))
        setHasMoreNumbers(availableNums.length >= NUMBERS_PER_PAGE)
      } else {
        // Agregar más números sin duplicados
        const newNumbers = availableNums.filter((num) => !displayNumbers.includes(num))
        const shuffledNew = [...newNumbers].sort(() => Math.random() - 0.5)
        setDisplayNumbers((prev) => [...prev, ...shuffledNew.slice(0, NUMBERS_PER_PAGE)])
        setHasMoreNumbers(newNumbers.length >= NUMBERS_PER_PAGE)
      }
    } catch (error) {
      console.error("Error loading available numbers:", error)
      if (reset) {
        setDisplayNumbers(generateRandomNumbers(NUMBERS_PER_PAGE, 1, 100000))
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreNumbers = async () => {
    if (!loadingMore && hasMoreNumbers) {
      setCurrentPage((prev) => prev + 1)
      await loadAvailableNumbers(false)
    }
  }

  const handleNumberSelect = (number: number) => {
    if (!availableNumbers.includes(number) || myNumbers.includes(number)) {
      return
    }

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number))
    } else {
      setSelectedNumbers([...selectedNumbers, number])
    }
  }

  const removeFromCart = (number: number) => {
    setSelectedNumbers(selectedNumbers.filter((n) => n !== number))
  }

  const handlePurchase = async () => {
    if (selectedNumbers.length === 0) return
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async () => {
    try {
      const purchasedNumbers = await purchaseNumbers(selectedNumbers, currentUser.id)

      if (purchasedNumbers.length > 0) {
        const totalAmount = purchasedNumbers.length * PRICE_PER_NUMBER
        await createTransaction({
          user_id: currentUser.id,
          amount: totalAmount,
          numbers: purchasedNumbers.map((n) => n.number),
          status: "completed",
        })

        const newNumbers = purchasedNumbers.map((n) => n.number)
        setMyNumbers([...myNumbers, ...newNumbers])
        setTotalInvested(totalInvested + totalAmount)
        setSelectedNumbers([])

        await loadAvailableNumbers()
      }
    } catch (error) {
      console.error("Error after payment:", error)
    }
  }

  const handleRandomSelection = () => {
    const reallyAvailable = availableNumbers.filter((num) => !selectedNumbers.includes(num) && !myNumbers.includes(num))
    const randomCount = Math.min(5, reallyAvailable.length)
    const randomNums = []

    for (let i = 0; i < randomCount; i++) {
      const randomIndex = Math.floor(Math.random() * reallyAvailable.length)
      randomNums.push(reallyAvailable[randomIndex])
      reallyAvailable.splice(randomIndex, 1)
    }

    setSelectedNumbers([...selectedNumbers, ...randomNums])
  }

  const shuffleNumbers = async () => {
    await loadAvailableNumbers(true)
  }

  const searchSpecificNumber = async () => {
    const num = Number.parseInt(searchNumber)
    if (num >= 1 && num <= 100000) {
      setHighlightedNumber(num)

      // Verificar si el número está disponible en la base de datos
      try {
        const { data: numberData, error } = await supabase
          .from("raffle_numbers")
          .select("*")
          .eq("number", num)
          .eq("raffle_id", 1)
          .single()

        if (!error && numberData) {
          // Si el número existe y está disponible, agregarlo a availableNumbers si no está
          if (numberData.status === "available" && !availableNumbers.includes(num)) {
            setAvailableNumbers((prev) => [...prev, num])
          }

          // Agregar a displayNumbers si no está
          if (!displayNumbers.includes(num)) {
            setDisplayNumbers([num, ...displayNumbers.slice(0, NUMBERS_PER_PAGE - 1)])
          }
        }
      } catch (error) {
        console.error("Error searching number:", error)
      }

      setSearchNumber("")
      setTimeout(() => setHighlightedNumber(null), 3000)
    }
  }

  const getNumberStatus = (number: number) => {
    if (myNumbers.includes(number)) return "owned"
    if (selectedNumbers.includes(number)) return "reserved"
    if (!availableNumbers.includes(number)) return "sold"
    return "available"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando números disponibles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Mobile/Desktop */}
      <div className="bg-white shadow-sm border-b w-full">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center min-w-0 flex-1">
              {isMobile ? (
                <Button variant="ghost" onClick={() => setShowSidebar(true)} className="mr-2 flex-shrink-0 p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              ) : (
                <Button variant="ghost" onClick={onBack} className="mr-4 flex-shrink-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              )}

              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-sky-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                    {currentUser?.name} {currentUser?.last_name}
                  </h1>
                  {!isMobile && <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {!isMobile && (
                <WhatsAppButton
                  variant="small"
                  message={`Hola! Soy ${currentUser?.name} ${currentUser?.last_name} y necesito ayuda con la rifa`}
                  className="mr-2"
                />
              )}
              <Button variant="outline" onClick={onBack} size="sm" className="flex-shrink-0 bg-transparent p-2">
                <LogOut className="w-4 h-4 mr-1" />
                {isMobile ? "" : "Cerrar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Mobile */}
      {isMobile ? (
        <div className="pb-20 w-full">
          {/* Tabs Mobile */}
          <div className="bg-white border-b px-3 py-2 w-full">
            <div className="flex space-x-1 w-full">
              <button
                onClick={() => setActiveTab("numbers")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "numbers" ? "bg-sky-500 text-white" : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                Números
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "info" ? "bg-sky-500 text-white" : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                Mi Info
              </button>
            </div>
          </div>

          {/* Contenido Mobile */}
          <div className="p-3 w-full">
            {activeTab === "info" ? (
              <div className="space-y-4 w-full">
                {/* Mis números */}
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Hash className="w-4 h-4 mr-2" />
                      Mis Números
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600">Números comprados:</p>
                          <p className="text-xl font-bold text-blue-600">{myNumbers.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total invertido:</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(totalInvested)}</p>
                        </div>
                      </div>

                      {myNumbers.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Tus números:</p>
                          <div className="flex flex-wrap gap-1">
                            {myNumbers.slice(0, 6).map((num) => (
                              <Badge key={num} variant="secondary" className="text-xs px-2 py-1">
                                {num.toString().padStart(6, "0")}
                              </Badge>
                            ))}
                            {myNumbers.length > 6 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs bg-transparent"
                                onClick={() => setShowMyNumbersModal(true)}
                              >
                                <Eye className="w-3 h-3 mr-1" />+{myNumbers.length - 6}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Información del usuario */}
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <User className="w-4 h-4 mr-2" />
                      Mi Información
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="break-words">
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium break-all text-xs">{currentUser?.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">DNI:</span>
                        <span className="ml-2 font-medium">{currentUser?.dni}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="ml-2 font-medium">{currentUser?.phone || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Soporte Mobile */}
                <Card className="w-full bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base text-green-800">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      ¿Necesitas Ayuda?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-green-700 mb-3">Contacta a nuestro soporte por WhatsApp</p>
                    <WhatsAppButton
                      message={`Hola! Soy ${currentUser?.name} ${currentUser?.last_name} y necesito ayuda con la rifa`}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Grilla de números */
              <div className="space-y-4 w-full">
                {/* Elegir al azar - Solo en tab números */}
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Elegir al Azar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={handleRandomSelection}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={availableNumbers.length === 0}
                    >
                      Seleccionar 5 números aleatorios
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {availableNumbers.length.toLocaleString()} números disponibles de 100,000
                    </p>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Números Disponibles</CardTitle>
                    <CardDescription className="text-xs">
                      Toca los números verdes para seleccionarlos • Mostrando {displayNumbers.length.toLocaleString()}{" "}
                      de 100,000 números
                    </CardDescription>

                    {/* Controles de búsqueda */}
                    <div className="flex gap-2 mt-3 w-full">
                      <div className="flex-1 flex gap-2 min-w-0">
                        <Input
                          type="number"
                          placeholder="Buscar número (1-100000)"
                          value={searchNumber}
                          onChange={(e) => setSearchNumber(e.target.value)}
                          min="1"
                          max="100000"
                          className="flex-1 min-w-0 text-sm h-9"
                        />
                        <Button
                          onClick={searchSpecificNumber}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 px-3"
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={shuffleNumbers}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent flex-shrink-0 px-3"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="w-full pt-0">
                    <NumberGrid
                      numbers={displayNumbers}
                      selectedNumbers={selectedNumbers}
                      myNumbers={myNumbers}
                      highlightedNumber={highlightedNumber}
                      onNumberSelect={handleNumberSelect}
                      getNumberStatus={getNumberStatus}
                    />

                    {/* Botón cargar más números */}
                    {hasMoreNumbers && (
                      <div className="mt-4 text-center">
                        <Button
                          onClick={loadMoreNumbers}
                          variant="outline"
                          disabled={loadingMore}
                          className="w-full bg-transparent"
                        >
                          {loadingMore ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Cargando más números...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Cargar más números (200)
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Layout Desktop - Mantener el original pero con mejoras responsive */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid lg:grid-cols-3 gap-8 w-full">
            {/* Panel izquierdo - Desktop */}
            <div className="lg:col-span-1 space-y-6 w-full">
              {/* Información del usuario */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Mi Información
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">DNI:</span>
                      <span className="ml-2 font-medium">{currentUser?.dni}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="ml-2 font-medium">{currentUser?.phone || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mis números */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hash className="w-5 h-5 mr-2" />
                    Mis Números
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Números comprados:</p>
                      <p className="text-2xl font-bold text-blue-600">{myNumbers.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total invertido:</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInvested)}</p>
                    </div>
                    {myNumbers.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Tus números:</p>
                        <div className="flex flex-wrap gap-1">
                          {myNumbers.slice(0, 6).map((num) => (
                            <Badge key={num} variant="secondary">
                              {num.toString().padStart(6, "0")}
                            </Badge>
                          ))}
                          {myNumbers.length > 6 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs bg-transparent"
                              onClick={() => setShowMyNumbersModal(true)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver todos ({myNumbers.length})
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Elegir al azar */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shuffle className="w-5 h-5 mr-2" />
                    Elegir al Azar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleRandomSelection}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={availableNumbers.length === 0}
                  >
                    Seleccionar 5 números aleatorios
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    {availableNumbers.length.toLocaleString()} números disponibles de 100,000
                  </p>
                </CardContent>
              </Card>

              {/* Soporte Desktop */}
              <Card className="w-full bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Soporte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-3">¿Tienes dudas o problemas? Contáctanos por WhatsApp</p>
                  <WhatsAppButton
                    message={`Hola! Soy ${currentUser?.name} ${currentUser?.last_name} y necesito ayuda con la rifa`}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Números seleccionados - Desktop */}
              {selectedNumbers.length > 0 && (
                <Card className="flex flex-col max-h-[500px] w-full">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Comprar Números
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1 overflow-y-auto">
                      <div>
                        <p className="text-sm text-gray-600">Números seleccionados:</p>
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          {selectedNumbers.map((num) => (
                            <button
                              key={num}
                              onClick={() => removeFromCart(num)}
                              className="bg-yellow-100 hover:bg-red-100 border border-yellow-300 hover:border-red-300 rounded-lg p-3 text-center transition-colors mb-2"
                            >
                              <span className="text-xs font-mono text-yellow-800 hover:text-red-800">
                                {num.toString().padStart(6, "0")}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Total a pagar:</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(selectedNumbers.length * PRICE_PER_NUMBER)}
                        </p>
                      </div>
                      <Button
                        onClick={handlePurchase}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                        disabled={purchasing}
                      >
                        {purchasing ? "Comprando..." : "Comprar Números"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Panel derecho - Grilla de números Desktop */}
            <div className="lg:col-span-2 w-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Números Disponibles</CardTitle>
                  <CardDescription>
                    Haz clic en los números verdes para seleccionarlos • Mostrando{" "}
                    {displayNumbers.length.toLocaleString()} de 100,000 números
                  </CardDescription>

                  <div className="flex gap-2 mt-4 w-full">
                    <div className="flex-1 flex gap-2 min-w-0">
                      <Input
                        type="number"
                        placeholder="Buscar número (1-100000)"
                        value={searchNumber}
                        onChange={(e) => setSearchNumber(e.target.value)}
                        min="1"
                        max="100000"
                        className="flex-1 min-w-0"
                      />
                      <Button
                        onClick={searchSpecificNumber}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={shuffleNumbers}
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent flex-shrink-0"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Actualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="w-full">
                  <NumberGrid
                    numbers={displayNumbers}
                    selectedNumbers={selectedNumbers}
                    myNumbers={myNumbers}
                    highlightedNumber={highlightedNumber}
                    onNumberSelect={handleNumberSelect}
                    getNumberStatus={getNumberStatus}
                  />

                  {/* Botón cargar más números */}
                  {hasMoreNumbers && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={loadMoreNumbers}
                        variant="outline"
                        disabled={loadingMore}
                        size="lg"
                        className="px-8 bg-transparent"
                      >
                        {loadingMore ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Cargando más números...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Cargar más números (200)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Carrito Mobile - Pill flotante mejorado */}
      {isMobile && selectedNumbers.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-white rounded-full shadow-2xl border border-gray-200 px-3 py-2 flex items-center gap-2 w-full max-w-sm mx-auto">
            <button
              onClick={() => setShowCartModal(true)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-full p-1 transition-colors flex-1 min-w-0"
            >
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{selectedNumbers.length} números</p>
                <p className="text-xs text-gray-500 truncate">
                  {formatCurrency(selectedNumbers.length * PRICE_PER_NUMBER)}
                </p>
              </div>
            </button>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                onClick={handlePurchase}
                size="sm"
                className="rounded-full px-3 bg-blue-600 hover:bg-blue-700 text-xs"
                disabled={purchasing}
              >
                {purchasing ? "..." : "Comprar"}
              </Button>
              <Button onClick={() => setSelectedNumbers([])} variant="ghost" size="sm" className="rounded-full p-2">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Mobile */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menú</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <WhatsAppButton
                message={`Hola! Soy ${currentUser?.name} ${currentUser?.last_name} y necesito ayuda con la rifa`}
                className="w-full justify-start"
              />
              <Button onClick={onBack} variant="outline" className="w-full justify-start bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full justify-start bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modales mejorados para responsive */}
      {showMyNumbersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mis Números Comprados</h3>
                <button onClick={() => setShowMyNumbersModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {myNumbers.map((num) => (
                  <div key={num} className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center">
                    <span className="text-xs font-mono text-blue-800">{num.toString().padStart(6, "0")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total: {myNumbers.length} números</span>
                <span className="font-bold text-green-600">{formatCurrency(totalInvested)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Mi Carrito ({selectedNumbers.length} números)
                </h3>
                <button onClick={() => setShowCartModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedNumbers.length > 0 ? (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                  {selectedNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => removeFromCart(num)}
                      className="bg-yellow-100 hover:bg-red-100 border border-yellow-300 hover:border-red-300 rounded-lg p-2 text-center transition-colors aspect-square flex items-center justify-center"
                    >
                      <span className="text-xs font-mono text-yellow-800 hover:text-red-800">
                        {num.toString().padStart(6, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Tu carrito está vacío</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total: {selectedNumbers.length} números</span>
                <span className="font-bold text-green-600 text-lg">
                  {formatCurrency(selectedNumbers.length * PRICE_PER_NUMBER)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedNumbers([])}
                  variant="outline"
                  className="flex-1"
                  disabled={selectedNumbers.length === 0}
                >
                  Vaciar Carrito
                </Button>
                <Button
                  onClick={() => {
                    handlePurchase()
                    setShowCartModal(false)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={selectedNumbers.length === 0 || purchasing}
                >
                  {purchasing ? "Comprando..." : "Confirmar Compra"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedNumbers={selectedNumbers}
        currentUser={currentUser}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
