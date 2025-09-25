'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { exportToCSV, exportToXLSX, type ExportColumn } from '@/lib/export'

interface ExportControlsProps {
  selectedItems: any[]
  allData: any[]
  columns: ExportColumn[]
  filename: string
  onSelectAll: () => void
  onClearSelection: () => void
}

export function ExportControls({
  selectedItems,
  allData,
  columns,
  filename,
  onSelectAll,
  onClearSelection,
}: ExportControlsProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to export')
      return
    }

    setIsExporting(true)

    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const exportFilename = `${filename}_${timestamp}`

      if (exportFormat === 'csv') {
        exportToCSV(selectedItems, columns, exportFilename)
      } else {
        await exportToXLSX(selectedItems, columns, exportFilename)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const isAllSelected =
    selectedItems.length === allData.length && allData.length > 0

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={isAllSelected ? onClearSelection : onSelectAll}
        />
        <span className="text-sm font-medium">
          Select All ({allData.length} items)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Selected:</span>
        <Badge variant="secondary">
          {selectedItems.length} of {allData.length}
        </Badge>
      </div>

      <Select
        value={exportFormat}
        onValueChange={(value: 'csv' | 'xlsx') => setExportFormat(value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CSV
            </div>
          </SelectItem>
          <SelectItem value="xlsx">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              XLSX
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={handleExport}
        disabled={selectedItems.length === 0 || isExporting}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export {selectedItems.length > 0 && `(${selectedItems.length})`}
      </Button>

      {selectedItems.length > 0 && (
        <Button variant="outline" onClick={onClearSelection}>
          Clear Selection
        </Button>
      )}
    </div>
  )
}
