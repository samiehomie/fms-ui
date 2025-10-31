"use client"

import { useState } from "react"
import {
  Calendar,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { vehicleListData } from "@/lib/mock-data/reports"
import {
  exportFleetOverview,
  exportVehicleDetail,
} from "@/lib/utils/report-export"
import type {
  ReportCategory,
  ExportFormat,
} from "@/types/features/reports/reports.types"
import DateRangePicker from "@/components/ui/data-range-picker"

export default function ReportsPage() {
  const [category, setCategory] = useState<ReportCategory>("fleet-overview")
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [startDate, setStartDate] = useState("2025-06-30")
  const [endDate, setEndDate] = useState("2025-10-31")

  // Filter vehicles based on search query
  const filteredVehicles = vehicleListData.filter((vehicle) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      vehicle.name.toLowerCase().includes(searchLower) ||
      vehicle.company.toLowerCase().includes(searchLower) ||
      vehicle.plateNo.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex)

  // Select all on current page
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = [...selectedVehicles]
      currentVehicles.forEach((v) => {
        if (!newSelected.includes(v.id)) {
          newSelected.push(v.id)
        }
      })
      setSelectedVehicles(newSelected)
    } else {
      const currentIds = currentVehicles.map((v) => v.id)
      setSelectedVehicles(
        selectedVehicles.filter((id) => !currentIds.includes(id)),
      )
    }
  }

  // Toggle individual vehicle
  const handleToggleVehicle = (id: number) => {
    if (selectedVehicles.includes(id)) {
      setSelectedVehicles(selectedVehicles.filter((vid) => vid !== id))
    } else {
      setSelectedVehicles([...selectedVehicles, id])
    }
  }

  // Check if all current page vehicles are selected
  const allCurrentSelected = currentVehicles.every((v) =>
    selectedVehicles.includes(v.id),
  )
  const someCurrentSelected = currentVehicles.some((v) =>
    selectedVehicles.includes(v.id),
  )

  // Export handler
  const handleExport = () => {
    if (selectedVehicles.length === 0) {
      alert("Please select at least one vehicle to export")
      return
    }

    const dateRange = { start: startDate, end: endDate }

    if (category === "fleet-overview") {
      const selected = vehicleListData.filter((v) =>
        selectedVehicles.includes(v.id),
      )
      exportFleetOverview(selected, dateRange, "xlsx")
    } else {
      // Export vehicle detail for each selected vehicle
      selectedVehicles.forEach((id) => {
        const vehicle = vehicleListData.find((v) => v.id === id)
        if (vehicle) {
          exportVehicleDetail(vehicle, dateRange, "xlsx")
        }
      })
    }
  }

  return (
    <div className="page-container">
      <div className="w-full">
        {/* Header Section */}
        <div className="bg-white mb-6">
          <div className="flex items-center justify-between mb-6">
            {/* Date Range Picker */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <DateRangePicker />
                {/* <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
                <span className="text-gray-500">—</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
                <Button size="icon" variant="outline">
                  <Calendar className="h-4 w-4" />
                </Button> */}
              </div>

              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search reports"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Search</Button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2">
              <Button
                variant={category === "fleet-overview" ? "default" : "ghost"}
                onClick={() => setCategory("fleet-overview")}
                className="rounded-md"
              >
                Fleet Overview
              </Button>
              <Button
                variant={category === "vehicle-detail" ? "default" : "ghost"}
                onClick={() => setCategory("vehicle-detail")}
                className="rounded-md"
              >
                Vehicle Detail
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white ">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-t border-x">
                <TableHead className="w-16 pl-4">
                  <Checkbox
                    checked={allCurrentSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Plate No.</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Can Bitrate</TableHead>
                <TableHead>Tires</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-gray-50">
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selectedVehicles.includes(vehicle.id)}
                      onCheckedChange={() => handleToggleVehicle(vehicle.id)}
                      aria-label={`Select vehicle ${vehicle.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell className="text-sm">{vehicle.company}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {vehicle.name}
                  </TableCell>
                  <TableCell className="text-sm">{vehicle.plateNo}</TableCell>
                  <TableCell
                    className="text-sm max-w-[300px] truncate"
                    title={vehicle.model}
                  >
                    {vehicle.model}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle.canBitrate}
                  </TableCell>
                  <TableCell className="text-sm">{vehicle.tires}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {vehicle.createdAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="flex items-center justify-between py-4 border-t border-gray-200">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                Selected:{" "}
                <span className="font-medium">{selectedVehicles.length}</span>{" "}
                of{" "}
                <span className="font-medium">{filteredVehicles.length}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* <Select
                  value={exportFormat}
                  onValueChange={(value) =>
                    setExportFormat(value as ExportFormat)
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select> */}

                <Button
                  onClick={handleExport}
                  disabled={selectedVehicles.length === 0}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
