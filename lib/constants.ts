// Configuración principal de la rifa
export const RAFFLE_CONFIG = {
  TOTAL_NUMBERS: 100000,
  MIN_NUMBER: 1,
  MAX_NUMBER: 100000,
  PRICE_PER_NUMBER: 1000,
  RAFFLE_ID: 1,
  RAFFLE_NAME: "Rifa Digital 2025",
  RAFFLE_DESCRIPTION: "Gran rifa de 100,000 números con increíbles premios",
  DRAW_DATE: "2025-12-31 20:00:00",
  PRIZE_DESCRIPTION: "Camiseta de la Selección Argentina firmada por todos los jugadores del plantel actual",
} as const

// Validaciones
export const VALIDATION = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 100000,
  MIN_PASSWORD_LENGTH: 6,
  MIN_DNI_LENGTH: 7,
  MAX_DNI_LENGTH: 8,
} as const

// Configuración de la aplicación
export const APP_CONFIG = {
  AUTO_REFRESH_INTERVAL: 30000, // 30 segundos
  NUMBERS_PER_PAGE: 100,
  MAX_RANDOM_SELECTION: 10,
  PAGINATION_SIZE: 20,
} as const
