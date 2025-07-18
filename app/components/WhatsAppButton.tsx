"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  variant?: "floating" | "inline" | "small"
  message?: string
  className?: string
}

export default function WhatsAppButton({
  variant = "inline",
  message = "Hola! Necesito ayuda con la rifa digital",
  className = "",
}: WhatsAppButtonProps) {
  const phoneNumber = "5492254596659" // Formato internacional para Argentina

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  if (variant === "floating") {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 ${className}`}
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  if (variant === "small") {
    return (
      <Button
        onClick={handleWhatsAppClick}
        variant="outline"
        size="sm"
        className={`bg-green-50 border-green-500 text-green-600 hover:bg-green-500 hover:text-white ${className}`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
    )
  }

  return (
    <Button onClick={handleWhatsAppClick} className={`bg-green-500 hover:bg-green-600 text-white ${className}`}>
      <MessageCircle className="w-4 h-4 mr-2" />
      Contactar Soporte
    </Button>
  )
}
