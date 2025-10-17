// Export utilities for CSV and XLSX functionality
export interface ExportColumn {
  key: string
  label: string
  format?: (value: any) => string
}

export function exportToCSV(
  data: any[],
  columns: ExportColumn[],
  filename: string,
) {
  // Create CSV header
  const headers = columns.map((col) => col.label).join(',')

  // Create CSV rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value = item[col.key]

        // Apply formatting if provided
        if (col.format && value !== null && value !== undefined) {
          value = col.format(value)
        }

        // Handle null/undefined values
        if (value === null || value === undefined) {
          value = ''
        }

        // Escape commas and quotes in CSV
        const stringValue = String(value)
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }

        return stringValue
      })
      .join(',')
  })

  // Combine header and rows
  const csvContent = [headers, ...rows].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function exportToXLSX(
  data: any[],
  columns: ExportColumn[],
  filename: string,
) {
  // Dynamic import to reduce bundle size
  const XLSX = await import('xlsx')

  // Prepare data for XLSX
  const worksheetData = data.map((item) => {
    const row: any = {}
    columns.forEach((col) => {
      let value = item[col.key]

      // Apply formatting if provided
      if (col.format && value !== null && value !== undefined) {
        value = col.format(value)
      }

      row[col.label] = value
    })
    return row
  })

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)

  // Auto-size columns
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.label.length, 15),
  }))
  worksheet['!cols'] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data')

  // Write and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US')
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US')
}

export function formatNumber(decimals = 2) {
  return (value: number): string => {
    return value.toFixed(decimals)
  }
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}
