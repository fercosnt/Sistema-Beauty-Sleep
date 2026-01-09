'use client'

import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: string // Format: YYYY-MM-DD (for internal storage)
  onChange: (value: string) => void // Returns YYYY-MM-DD format
  displayFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' // Display format
}

/**
 * DateInput Component
 * 
 * Custom date input that displays dates in DD/MM/YYYY format
 * but stores them internally as YYYY-MM-DD for database compatibility
 */
const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value, onChange, displayFormat = 'DD/MM/YYYY', placeholder, ...props }, ref) => {
    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    const formatForDisplay = (dateString: string): string => {
      if (!dateString || dateString.length !== 10) return ''
      const [year, month, day] = dateString.split('-')
      if (displayFormat === 'DD/MM/YYYY') {
        return `${day}/${month}/${year}`
      } else {
        return `${month}/${day}/${year}`
      }
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD for storage
    const parseFromDisplay = (displayValue: string): string => {
      // Remove any non-digit characters except /
      const cleaned = displayValue.replace(/[^\d/]/g, '')
      
      if (displayFormat === 'DD/MM/YYYY') {
        // Format: DD/MM/YYYY
        const parts = cleaned.split('/').filter(Boolean)
        if (parts.length === 3) {
          const [day, month, year] = parts
          // Validate and pad
          const dayPadded = day.padStart(2, '0')
          const monthPadded = month.padStart(2, '0')
          const yearFull = year.length === 2 ? `20${year}` : year
          
          // Basic validation
          if (dayPadded.length === 2 && monthPadded.length === 2 && yearFull.length === 4) {
            return `${yearFull}-${monthPadded}-${dayPadded}`
          }
        }
      } else {
        // Format: MM/DD/YYYY
        const parts = cleaned.split('/').filter(Boolean)
        if (parts.length === 3) {
          const [month, day, year] = parts
          const monthPadded = month.padStart(2, '0')
          const dayPadded = day.padStart(2, '0')
          const yearFull = year.length === 2 ? `20${year}` : year
          
          if (monthPadded.length === 2 && dayPadded.length === 2 && yearFull.length === 4) {
            return `${yearFull}-${monthPadded}-${dayPadded}`
          }
        }
      }
      
      return ''
    }

    const [displayValue, setDisplayValue] = React.useState(() => formatForDisplay(value))
    const [isFocused, setIsFocused] = React.useState(false)

    // Update display value when prop value changes (but not while user is typing)
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatForDisplay(value))
      }
    }, [value, isFocused, displayFormat])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value
      
      // Remove all non-digit characters
      const digitsOnly = inputValue.replace(/\D/g, '')
      
      // Apply mask based on format
      if (displayFormat === 'DD/MM/YYYY') {
        // Format: DD/MM/YYYY
        if (digitsOnly.length <= 2) {
          inputValue = digitsOnly
        } else if (digitsOnly.length <= 4) {
          inputValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
        } else {
          inputValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`
        }
      } else {
        // Format: MM/DD/YYYY
        if (digitsOnly.length <= 2) {
          inputValue = digitsOnly
        } else if (digitsOnly.length <= 4) {
          inputValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
        } else {
          inputValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`
        }
      }
      
      setDisplayValue(inputValue)
      
      // Try to parse and convert to YYYY-MM-DD when we have a complete date
      if (digitsOnly.length >= 8) {
        const parsed = parseFromDisplay(inputValue)
        if (parsed && parsed.length === 10) {
          // Validate the date
          const date = new Date(parsed)
          if (!isNaN(date.getTime())) {
            onChange(parsed)
          }
        }
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      
      // On blur, ensure the value is properly formatted
      const parsed = parseFromDisplay(displayValue)
      if (parsed && parsed.length === 10) {
        const date = new Date(parsed)
        if (!isNaN(date.getTime())) {
          setDisplayValue(formatForDisplay(parsed))
          onChange(parsed)
        } else {
          // Invalid date, reset to original value
          setDisplayValue(formatForDisplay(value))
        }
      } else {
        // Invalid format, reset to original value
        setDisplayValue(formatForDisplay(value))
      }
      
      props.onBlur?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    return (
      <input
        type="text"
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder || (displayFormat === 'DD/MM/YYYY' ? 'DD/MM/AAAA' : 'MM/DD/AAAA')}
        maxLength={displayFormat === 'DD/MM/YYYY' ? 10 : 10}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)

DateInput.displayName = 'DateInput'

export { DateInput }

