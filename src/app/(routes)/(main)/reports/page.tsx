"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Truck,
  Users,
  Fuel,
  Wrench,
  AlertTriangle,
  Route,
  DollarSign,
  SortAsc,
  SortDesc,
  TrendingUp,
} from "lucide-react"
import {
  ReportFilters,
  type FilterState,
} from "@/components/features/reports/report-filters"
import { ExportControls } from "@/components/features/reports/export-controls"
import { enhancedReportsData } from "@/lib/mock_data/enhanced-reports"
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatDuration,
  type ExportColumn,
} from "@/lib/utils/report-export"
import type { TripReport, VehicleReport } from "@/lib/mock_data/reports"

const reportTabs = [
  {
    id: "trips",
    label: "Trip Reports",
    icon: Route,
    description: "Detailed trip analysis and performance",
  },
  {
    id: "vehicles",
    label: "Vehicle Reports",
    icon: Truck,
    description: "Vehicle performance and utilization",
  },
  {
    id: "drivers",
    label: "Driver Reports",
    icon: Users,
    description: "Driver performance and safety metrics",
  },
  {
    id: "fuel",
    label: "Fuel Reports",
    icon: Fuel,
    description: "Fuel consumption and cost analysis",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    description: "Maintenance schedules and costs",
  },
  {
    id: "incidents",
    label: "Incidents",
    icon: AlertTriangle,
    description: "Safety incidents and violations",
  },
  {
    id: "routes",
    label: "Route Analysis",
    icon: Route,
    description: "Route efficiency and optimization",
  },
  {
    id: "costs",
    label: "Cost Analysis",
    icon: DollarSign,
    description: "Financial analysis and budgeting",
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("trips")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateRange: {},
    status: "",
    vehicle: "",
    driver: "",
    category: "",
  })

  // Get filtered and sorted data
  const processedData = useMemo(() => {
    let data = enhancedReportsData[
      activeTab as keyof typeof enhancedReportsData
    ] as any[]

    // Apply filters
    if (filters.search) {
      data = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filters.search.toLowerCase()),
        ),
      )
    }

    if (filters.status) {
      data = data.filter((item) => item.status === filters.status)
    }

    if (filters.vehicle) {
      data = data.filter((item) => item.plateNumber === filters.vehicle)
    }

    if (filters.driver) {
      data = data.filter(
        (item) =>
          item.driverName === filters.driver || item.name === filters.driver,
      )
    }

    if (filters.category) {
      data = data.filter(
        (item) =>
          item.category === filters.category || item.type === filters.category,
      )
    }

    // Apply sorting
    if (sortField) {
      data = [...data].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()

        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    return data
  }, [activeTab, filters, sortField, sortDirection])

  // Get available filter options
  const filterOptions = useMemo(() => {
    const data = enhancedReportsData[
      activeTab as keyof typeof enhancedReportsData
    ] as any[]

    return {
      vehicles: [
        ...new Set(data.map((item) => item.plateNumber).filter(Boolean)),
      ],
      drivers: [
        ...new Set(
          data.map((item) => item.driverName || item.name).filter(Boolean),
        ),
      ],
      statuses: [...new Set(data.map((item) => item.status).filter(Boolean))],
      categories: [
        ...new Set(
          data.map((item) => item.category || item.type).filter(Boolean),
        ),
      ],
    }
  }, [activeTab])

  const handleSelectAll = () => {
    if (selectedItems.length === processedData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(processedData.map((item) => item.id))
    }
  }

  const handleItemSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  // Define export columns for each report type
  const getExportColumns = (): ExportColumn[] => {
    switch (activeTab) {
      case "trips":
        return [
          { key: "plateNumber", label: "Vehicle" },
          { key: "driverName", label: "Driver" },
          { key: "startTime", label: "Start Time", format: formatDateTime },
          { key: "endTime", label: "End Time", format: formatDateTime },
          { key: "startLocation", label: "Start Location" },
          { key: "endLocation", label: "End Location" },
          { key: "distance", label: "Distance (km)", format: formatNumber(1) },
          { key: "duration", label: "Duration", format: formatDuration },
          {
            key: "averageSpeed",
            label: "Avg Speed (km/h)",
            format: formatNumber(1),
          },
          {
            key: "maxSpeed",
            label: "Max Speed (km/h)",
            format: formatNumber(1),
          },
          {
            key: "fuelConsumed",
            label: "Fuel Consumed (L)",
            format: formatNumber(1),
          },
          {
            key: "fuelEfficiency",
            label: "Fuel Efficiency (km/L)",
            format: formatNumber(1),
          },
          { key: "status", label: "Status" },
          { key: "cost", label: "Cost", format: formatCurrency },
        ]
      case "vehicles":
        return [
          { key: "plateNumber", label: "Plate Number" },
          { key: "brand", label: "Brand" },
          { key: "model", label: "Model" },
          { key: "year", label: "Year" },
          { key: "mileage", label: "Mileage (km)" },
          { key: "fuelType", label: "Fuel Type" },
          { key: "status", label: "Status" },
          { key: "totalTrips", label: "Total Trips" },
          {
            key: "totalDistance",
            label: "Total Distance (km)",
            format: formatNumber(1),
          },
          {
            key: "averageFuelEfficiency",
            label: "Avg Fuel Efficiency (km/L)",
            format: formatNumber(1),
          },
          {
            key: "utilizationRate",
            label: "Utilization Rate (%)",
            format: formatNumber(1),
          },
        ]
      case "drivers":
        return [
          { key: "name", label: "Name" },
          { key: "licenseNumber", label: "License Number" },
          { key: "email", label: "Email" },
          { key: "hireDate", label: "Hire Date", format: formatDate },
          { key: "status", label: "Status" },
          { key: "totalTrips", label: "Total Trips" },
          {
            key: "totalDistance",
            label: "Total Distance (km)",
            format: formatNumber(1),
          },
          {
            key: "averageSpeed",
            label: "Avg Speed (km/h)",
            format: formatNumber(1),
          },
          {
            key: "safetyScore",
            label: "Safety Score",
            format: formatNumber(1),
          },
          {
            key: "onTimeDeliveryRate",
            label: "On-Time Delivery (%)",
            format: formatNumber(1),
          },
        ]
      default:
        return []
    }
  }

  const renderDataTable = () => {
    if (activeTab === "trips") {
      const data = processedData as TripReport[]
      return (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={
                        selectedItems.length === data.length && data.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("plateNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Vehicle
                      {sortField === "plateNumber" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("driverName")}
                  >
                    <div className="flex items-center gap-2">
                      Driver
                      {sortField === "driverName" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("distance")}
                  >
                    <div className="flex items-center gap-2">
                      Distance
                      {sortField === "distance" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("fuelEfficiency")}
                  >
                    <div className="flex items-center gap-2">
                      Fuel Efficiency
                      {sortField === "fuelEfficiency" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortField === "status" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort("cost")}
                  >
                    <div className="flex items-center gap-2">
                      Cost
                      {sortField === "cost" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((trip) => (
                  <tr key={trip.id} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedItems.includes(trip.id)}
                        onCheckedChange={() => handleItemSelect(trip.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{trip.plateNumber}</td>
                    <td className="p-3">{trip.driverName}</td>
                    <td className="p-3">{trip.distance.toFixed(1)} km</td>
                    <td className="p-3">
                      {trip.fuelEfficiency.toFixed(1)} km/L
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          trip.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {trip.status}
                      </Badge>
                    </td>
                    <td className="p-3">{formatCurrency(trip.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // Similar tables for other report types would go here
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Report Table Coming Soon</h3>
        <p className="text-muted-foreground">
          This report table is currently under development.
        </p>
      </div>
    )
  }

  const selectedData = processedData.filter((item) =>
    selectedItems.includes(item.id),
  )

  return (
    <div className="container">
      <main className="container mx-auto my-10 ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto p-1">
            {reportTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1 py-2 px-3 h-auto"
              >
                {/* <tab.icon className="h-4 w-4" /> */}
                <span className="text-xs">{tab.label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Filters */}
          <ReportFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableVehicles={filterOptions.vehicles}
            availableDrivers={filterOptions.drivers}
            availableStatuses={filterOptions.statuses}
            availableCategories={filterOptions.categories}
          />

          {/* Export Controls */}
          <ExportControls
            selectedItems={selectedData}
            allData={processedData}
            columns={getExportColumns()}
            filename={`${activeTab}_report`}
            onSelectAll={handleSelectAll}
            onClearSelection={clearSelection}
          />

          {/* Report Content */}
          {reportTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <div className=" shadow-none">
                {/* <div>
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tab.description}
                  </p>
                </div> */}
                <div className="space-y-6">
                  {/* {renderSummaryCards()} */}
                  {renderDataTable()}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
