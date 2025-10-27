'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Truck, Users } from 'lucide-react'
import DateRangePicker from '@/components/ui/data-range-picker'

export interface FilterState {
  search: string
  dateRange: { from?: Date; to?: Date }
  status: string
  vehicle: string
  driver: string
  category: string
}

interface ReportFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableVehicles?: string[]
  availableDrivers?: string[]
  availableStatuses?: string[]
  availableCategories?: string[]
}

export function ReportFilters({
  filters,
  onFiltersChange,
  availableVehicles = [],
  availableDrivers = [],
  availableStatuses = [],
  availableCategories = [],
}: ReportFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: {},
      status: '',
      vehicle: '',
      driver: '',
      category: '',
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.status) count++
    if (filters.vehicle) count++
    if (filters.driver) count++
    if (filters.category) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <DateRangePicker />
          {availableStatuses.length > 0 && (
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {availableVehicles.length > 0 && (
            <Select
              value={filters.vehicle}
              onValueChange={(value) => updateFilter('vehicle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {availableVehicles.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {vehicle}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {availableDrivers.length > 0 && (
            <Select
              value={filters.driver}
              onValueChange={(value) => updateFilter('driver', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Drivers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                {availableDrivers.map((driver) => (
                  <SelectItem key={driver} value={driver}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {driver}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {availableCategories.length > 0 && (
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('search', '')}
                />
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('status', '')}
                />
              </Badge>
            )}
            {filters.vehicle && (
              <Badge variant="secondary" className="gap-1">
                Vehicle: {filters.vehicle}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('vehicle', '')}
                />
              </Badge>
            )}
            {filters.driver && (
              <Badge variant="secondary" className="gap-1">
                Driver: {filters.driver}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('driver', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
