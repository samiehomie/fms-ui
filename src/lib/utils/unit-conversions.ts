export type PressureUnit = 'PSI' | 'BAR' | 'kPa'
export type TemperatureUnit = '°C' | '°F' | 'cff'

// Pressure conversions (from PSI)
export function convertPressure(
  value: number,
  fromUnit: PressureUnit,
  toUnit: PressureUnit,
): number {
  if (fromUnit === toUnit) return value

  // Convert to PSI first
  let psi = value
  if (fromUnit === 'BAR') psi = value * 14.5038
  if (fromUnit === 'kPa') psi = value * 0.145038

  // Convert from PSI to target unit
  if (toUnit === 'PSI') return Math.round(psi)
  if (toUnit === 'BAR') return Math.round((psi / 14.5038) * 100) / 100
  if (toUnit === 'kPa') return Math.round(psi / 0.145038)

  return value
}

// Temperature conversions (from Celsius)
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit,
): number {
  if (fromUnit === toUnit) return value

  // Convert to Celsius first
  let celsius = value
  if (fromUnit === '°F') celsius = ((value - 32) * 5) / 9
  if (fromUnit === 'cff') celsius = value // Assuming cff is same as Celsius for now

  // Convert from Celsius to target unit
  if (toUnit === '°C') return Math.round(celsius * 10) / 10
  if (toUnit === '°F') return Math.round(((celsius * 9) / 5 + 32) * 10) / 10
  if (toUnit === 'cff') return Math.round(celsius * 10) / 10

  return value
}

// Format display value with unit
export function formatPressure(value: number, unit: PressureUnit): string {
  return `${convertPressure(value, 'PSI', unit)}`
}

export function formatTemperature(
  value: number,
  unit: TemperatureUnit,
): string {
  const converted = convertTemperature(value, '°C', unit)
  return converted > 0 ? `+${converted}` : `${converted}`
}
