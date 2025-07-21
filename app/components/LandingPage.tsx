"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, DollarSign, Clock, Star, Shield, Zap, LogIn, Gift, MessageCircle, Phone } from "lucide-react"
import { RAFFLE_CONFIG } from "../../lib/constants"
import { formatCurrency } from "../lib/utils"
import LoginModal from "./LoginModal"
import WhatsAppButton from "./WhatsAppButton"

interface LandingPageProps {
  onLoginSuccess: (userData: any) => void
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-90"></div>
        <div className="relative w-full max-w-none mx-auto px-4 py-16 sm:py-24">
          <div className="text-center w-full">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2 leading-tight">
              🎲 {RAFFLE_CONFIG.RAFFLE_NAME}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-sky-100 mb-6 sm:mb-8 max-w-4xl mx-auto px-4 leading-relaxed">
              Participa en nuestra gran rifa de <strong>{RAFFLE_CONFIG.TOTAL_NUMBERS.toLocaleString()} números</strong>{" "}
              con increíbles premios. ¡Solo {formatCurrency(RAFFLE_CONFIG.PRICE_PER_NUMBER)} por número!
            </p>
            <div className="flex justify-center px-4 max-w-lg mx-auto">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-sky-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                onClick={() => setShowLoginModal(true)}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Participar Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12 px-2">
          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-4">
              <div className="bg-sky-100 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-4">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 mb-1 sm:mb-2">
                {formatCurrency(RAFFLE_CONFIG.PRICE_PER_NUMBER)}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Por número</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-4">
              <div className="bg-emerald-100 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-4">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">
                {RAFFLE_CONFIG.TOTAL_NUMBERS.toLocaleString()}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Números totales</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-4">
              <div className="bg-rose-100 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 mb-1 sm:mb-2">∞</div>
              <p className="text-xs sm:text-sm text-gray-600">Participantes</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-4">
              <div className="bg-violet-100 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600 mb-1 sm:mb-2">24/7</div>
              <p className="text-xs sm:text-sm text-gray-600">Disponible</p>
            </CardContent>
          </Card>
        </div>

        {/* Información del Premio */}
        <Card className="mb-12 mx-2 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="bg-yellow-100 rounded-full p-3 w-fit mx-auto mb-4">
              <Gift className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-yellow-800">🏆 Gran Premio</CardTitle>
            <CardDescription className="text-lg text-yellow-700">{RAFFLE_CONFIG.PRIZE_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="bg-white rounded-lg p-6 border border-yellow-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">✨ Características del Premio:</h4>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• Camiseta oficial de la AFA</li>
                    <li>• Firmada por TODOS los jugadores</li>
                    <li>• Plantel actual de la Selección</li>
                    <li>• Pieza única e irrepetible</li>
                    <li>• Certificado de autenticidad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">📅 Información del Sorteo:</h4>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li>
                      • <strong>Fecha:</strong> 31 de Diciembre 2025
                    </li>
                    <li>
                      • <strong>Hora:</strong> 20:00hs
                    </li>
                    <li>
                      • <strong>Modalidad:</strong> Un solo ganador
                    </li>
                    <li>
                      • <strong>Números totales:</strong> {RAFFLE_CONFIG.TOTAL_NUMBERS.toLocaleString()}
                    </li>
                    <li>
                      • <strong>Entrega:</strong> Inmediata
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-12 px-2">
          <Card className="w-full">
            <CardHeader className="px-4 sm:px-6">
              <div className="bg-sky-100 rounded-full p-2 sm:p-3 w-fit mb-2 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
              </div>
              <CardTitle className="text-base sm:text-lg">Compra Instantánea</CardTitle>
              <CardDescription className="text-sm">
                Selecciona tus números favoritos y compra al instante de forma segura
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="w-full">
            <CardHeader className="px-4 sm:px-6">
              <div className="bg-emerald-100 rounded-full p-2 sm:p-3 w-fit mb-2 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-base sm:text-lg">100% Seguro</CardTitle>
              <CardDescription className="text-sm">
                Todos los números y transacciones están protegidos y verificados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="w-full">
            <CardHeader className="px-4 sm:px-6">
              <div className="bg-rose-100 rounded-full p-2 sm:p-3 w-fit mb-2 sm:mb-4">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
              </div>
              <CardTitle className="text-base sm:text-lg">Premio Único</CardTitle>
              <CardDescription className="text-sm">
                Una pieza de colección que no podrás conseguir en ningún otro lugar
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Cómo Participar */}
        <Card className="mb-12 mx-2">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">¿Cómo Participar?</CardTitle>
            <CardDescription>Es muy fácil, solo sigue estos pasos</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="bg-sky-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Regístrate</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Crea tu cuenta con tus datos personales de forma segura
                </p>
              </div>
              <div className="text-center">
                <div className="bg-sky-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Elige Números</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Selecciona tus números favoritos o déjanos elegir por ti
                </p>
              </div>
              <div className="text-center">
                <div className="bg-sky-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">¡Participa!</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Completa tu compra y espera el día del sorteo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soporte y Contacto */}
        <Card className="mb-12 mx-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-green-800">💬 ¿Necesitas Ayuda?</CardTitle>
            <CardDescription className="text-lg text-green-700">
              Nuestro equipo de soporte está disponible para ayudarte
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Contacto Directo
                  </h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>
                      • WhatsApp: <strong>2254-596659</strong>
                    </li>
                    <li>• Respuesta inmediata</li>
                    <li>• Atención personalizada</li>
                    <li>• Disponible 24/7</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">🤝 Te Ayudamos Con:</h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Problemas de registro</li>
                    <li>• Consultas sobre pagos</li>
                    <li>• Verificación de números</li>
                    <li>• Información del sorteo</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <WhatsAppButton message="Hola! Necesito ayuda con la Rifa Digital 2025" className="text-lg px-8 py-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
          <h4 className="font-medium text-sky-800 mb-2">📋 Términos y Condiciones</h4>
          <div className="text-sm text-sky-700 space-y-1">
            <p>• Solo mayores de 18 años pueden participar</p>
            <p>• Cada persona puede comprar múltiples números</p>
            <p>• Total de números disponibles: {RAFFLE_CONFIG.TOTAL_NUMBERS.toLocaleString()}</p>
            <p>• Precio por número: {formatCurrency(RAFFLE_CONFIG.PRICE_PER_NUMBER)}</p>
            <p>• El sorteo se realizará en vivo y será transmitido</p>
            <p>• El ganador será contactado inmediatamente</p>
            <p>• El premio debe ser retirado en un plazo de 30 días</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">¡No Te Quedes Sin Participar!</h2>
          <p className="text-xl mb-6 text-sky-100">
            {RAFFLE_CONFIG.TOTAL_NUMBERS.toLocaleString()} números disponibles. ¡Encuentra el tuyo y participa por este
            increíble premio!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-sky-600 hover:bg-sky-50 text-lg px-8 py-4"
              onClick={() => setShowLoginModal(true)}
            >
              <Star className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </Button>
          
          </div>
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton variant="floating" message="Hola! Necesito ayuda con la Rifa Digital 2025" />

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={onLoginSuccess} />
    </div>
  )
}
