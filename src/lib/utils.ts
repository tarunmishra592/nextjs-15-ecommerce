import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}


export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN', {
  currency: 'INR',
  style: 'currency',
  minimumFractionDigits: 2
})
export function currency_formate(amount: number){
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-IN')
export function number_formate(num: number){
  return NUMBER_FORMATTER.format(num)
}


export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const generateId = () => {
  return Array.from({length: 24}, () => Math.floor(Math.random() * 10)).join('')
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formateError = (err: any) => {
  if (err.name === 'ZodError') {
    const fieldErrors = Object.keys(err.errors).map((field) => {
      const errorMessage = err.errors[field].message
      return `${err.errors[field].path}: ${errorMessage}` // field: errorMessage
    })
    return fieldErrors.join('. ')
  } else if (err.name === 'ValidationError') {
    const fieldErrors = Object.keys(err.errors).map((field) => {
      const errorMessage = err.errors[field].message
      return errorMessage
    })
    return fieldErrors.join('. ')
  } else if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0]
    return `${duplicateField} already exists`
  } else {
    // return 'Something went wrong. please try again'
    return typeof err.message === 'string'
      ? err.message
      : JSON.stringify(err.message)
  }
}

export const calculateFutureDate = (days: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate
}

export const getMonthName = (yearAndMonth: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [year, monthNumber] = yearAndMonth.split('-')
  const date = new Date()
  date.setMonth(parseInt(monthNumber) - 1)
  return new Date().getMonth() === parseInt(monthNumber) - 1
    ? `${date.toLocaleString('default', { month: 'long' })} (ongoing)`
    : date.toLocaleString('default', { month: 'long' })
}

export const calculatePastDate = (days: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days);
  return currentDate
}

export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0) // Set to 12:00 AM (next day)

  const diff = midnight.getTime() - now.getTime() // Difference in milliseconds
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-IN',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-IN',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-IN',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export function formateId(id: string){
  return `...${id.substring(id.length, 6)}`
}