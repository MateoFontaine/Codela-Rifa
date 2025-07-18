export function generateRandomNumbers(count: number, min: number, max: number): number[] {
  const numbers = new Set<number>()

  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
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

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}
