/**
 * @description Типы данных для API бэкенда.
 * @remarks Основано на Swagger-спецификации.
 */

/**
 * @description Фильм.
 */
export interface Movie {
  id: number
  title: string
  description: string
  year: number
  lengthMinutes: number
  posterImage: string
  rating: number
}

/**
 * @description Кинотеатр.
 */
export interface Cinema {
  id: number
  name: string
  address: string
}

/**
 * @description Информация о местах в зале.
 */
export interface Seats {
  rows: number
  seatsPerRow: number
}

/**
 * @description Место в кинозале.
 */
export interface Seat {
  rowNumber: number
  seatNumber: number
}

/**
 * @description Базовый киносеанс.
 */
export interface MovieSession {
  id: number
  movieId: number
  cinemaId: number
  /**
   * Время начала сеанса (дата и время в формате ISO 8601, тип «date-time»).
   */
  startTime: string
}

/**
 * @description Детали киносеанса с забронированными местами и схемой зала.
 */
export interface MovieSessionDetails extends MovieSession {
  seats: Seats
  bookedSeats: Seat[]
}

/**
 * @description Бронирование пользователя.
 */
export interface Booking {
  id: string
  userId: number
  movieSessionId: number
  /**
   * Время создания бронирования (дата и время в формате ISO 8601, тип «date-time»).
   */
  bookedAt: string
  seats: Seat[]
  isPaid: boolean
}

/**
 * @description Настройки приложения.
 */
export interface Settings {
  bookingPaymentTimeSeconds: number
}

/**
 * @description Стандартный ответ об ошибке.
 */
export interface ErrorResponse {
  message: string
  error?: string
}

/**
 * @description Данные для регистрации.
 */
export interface RegisterData {
  username: string
  password: string
  passwordConfirmation: string
}

/**
 * @description Данные для регистрационного запроса к API.
 */
export interface RegisterRequest {
  username: string
  password: string
}

/**
 * @description Данные для логина.
 */
export interface LoginData {
  username: string
  password: string
}

/**
 * @description Ответ при успешной авторизации.
 */
export interface AuthResponse {
  token: string
}

/**
 * @description Данные для бронирования мест.
 */
export interface BookingData {
  seats: Seat[]
}

/**
 * @description Ответ при создании бронирования.
 */
export interface BookingCreateResponse {
  bookingId: string
}

/**
 * @description Ответ при оплате бронирования.
 */
export interface BookingPaymentResponse {
  message: string
}

