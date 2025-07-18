import { RAFFLE_CONFIG, VALIDATION } from "../../lib/constants"

export function generateRandomNumbers(count: number, min?: number, max?: number): number[] {
  const minNum = min || VALIDATION.MIN_NUMBER
  const maxNum = max || VALIDATION.MAX_NUMBER
  const numbers = new Set<number>()

  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
    numbers.add(randomNum)
  }

  return Array.from(numbers).sort((a, b) => a - b)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(number: number, padLength = 6): string {
  return number.toString().padStart(padLength, "0")
}

export function validateNumberRange(number: number): boolean {
  return number >= VALIDATION.MIN_NUMBER && number <= VALIDATION.MAX_NUMBER
}

export function calculateProgress(soldNumbers: number): number {
  return (soldNumbers / RAFFLE_CONFIG.TOTAL_NUMBERS) * 100
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}
