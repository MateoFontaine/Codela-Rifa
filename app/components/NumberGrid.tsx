"use client"
import { cn } from "@/lib/utils"

interface NumberGridProps {
  numbers: number[]
  selectedNumbers: number[]
  myNumbers: number[]
  highlightedNumber?: number | null
  onNumberSelect: (number: number) => void
  getNumberStatus?: (number: number) => string
}

export default function NumberGrid({
  numbers,
  selectedNumbers,
  myNumbers,
  highlightedNumber,
  onNumberSelect,
  getNumberStatus,
}: NumberGridProps) {
  const defaultGetNumberStatus = (number: number) => {
    if (myNumbers.includes(number)) return "owned"
    if (selectedNumbers.includes(number)) return "reserved"
    if (number % 17 === 0) return "sold"
    return "available"
  }

  const getStatus = getNumberStatus || defaultGetNumberStatus

  const getButtonClass = (status: string, isHighlighted: boolean) => {
    if (isHighlighted) {
      return "bg-purple-500 text-white animate-pulse border-2 border-purple-300 shadow-lg"
    }

    switch (status) {
      case "owned":
        return "bg-blue-500 text-white border-blue-600"
      case "reserved":
        return "bg-yellow-500 text-white border-yellow-600"
      case "sold":
        return "bg-red-500 text-white cursor-not-allowed border-red-600"
      default:
        return "bg-green-500 text-white border-green-600 hover:bg-green-600 active:bg-green-700"
    }
  }

  return (
    <div className="w-full">
      {/* Leyenda */}
      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded flex-shrink-0"></div>
          <span className="whitespace-nowrap">Disponible</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded flex-shrink-0"></div>
          <span className="whitespace-nowrap">En carrito</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded flex-shrink-0"></div>
          <span className="whitespace-nowrap">Vendido</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded flex-shrink-0"></div>
          <span className="whitespace-nowrap">Mis números</span>
        </div>
      </div>

      {/* Grilla de números - Sin scroll, completamente responsive */}
      <div className="w-full">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1 sm:gap-2 p-2 sm:p-4 bg-white rounded-lg border">
          {numbers.map((number) => {
            const status = getStatus(number)
            const isHighlighted = highlightedNumber === number
            const isDisabled = status === "sold" || status === "owned"

            return (
              <button
                key={number}
                className={cn(
                  "aspect-square w-full text-xs font-mono transition-all duration-200 rounded-md border-2 font-semibold flex items-center justify-center",
                  getButtonClass(status, isHighlighted),
                  !isDisabled && "active:scale-95",
                )}
                disabled={isDisabled}
                onClick={() => !isDisabled && onNumberSelect(number)}
              >
                <span className="text-[10px] sm:text-xs leading-none">{number.toString().padStart(6, "0")}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
