// lib/exportUtils.ts
import * as XLSX from "xlsx"
import type {
  VehicleData,
  ExportFormat,
} from "@/types/features/reports/reports.types"

export const generateFleetOverviewData = (
  vehicles: VehicleData[],
  dateRange: { start: string; end: string },
) => {
  // Fleet Summary
  const companyCounts: { [key: string]: number } = {}
  vehicles.forEach((v) => {
    companyCounts[v.company] = (companyCounts[v.company] || 0) + 1
  })

  const fleetSummary = Object.entries(companyCounts).map(
    ([company, count]) => ({
      company,
      totalVehicles: count,
      active: Math.floor(count * 0.85),
      maintenance: Math.floor(count * 0.1),
      idle: Math.floor(count * 0.05),
      utilization: 0.85 + Math.random() * 0.1,
    }),
  )

  // Vehicle Performance
  const vehiclePerformance = vehicles.map((v) => ({
    vehicleId: `VH-${v.id.toString().padStart(4, "0")}`,
    type: v.model.includes("Excavator")
      ? "Excavator"
      : v.model.includes("Dozer") || v.model.includes("Bulldozer")
      ? "Bulldozer"
      : v.model.includes("Loader")
      ? "Wheel Loader"
      : v.model.includes("Crane")
      ? "Crane"
      : "Truck",
    model: v.model.split(" ").slice(0, 2).join(" "),
    operatingHours: Math.floor(150 + Math.random() * 200),
    distance: Math.floor(1500 + Math.random() * 3000),
    fuelUsed: Math.floor(3000 + Math.random() * 4000),
    fuelEfficiency: 15 + Math.random() * 10,
    idleTime: Math.floor(30 + Math.random() * 80),
    idlePercent: 0.15 + Math.random() * 0.15,
    avgSpeed: 8 + Math.random() * 8,
    loadFactor: 0.7 + Math.random() * 0.25,
    performanceScore: 0.5 + Math.random() * 0.4,
    status: Math.random() > 0.3 ? "Good" : "Fair",
  }))

  // Tire Health
  const tireHealth: any[] = []
  vehicles.forEach((v) => {
    const positions =
      v.tires === 4
        ? ["FL", "FR", "RL", "RR"]
        : ["FL", "FR", "RL1", "RR1", "RL2", "RR2"]
    positions.forEach((pos, idx) => {
      tireHealth.push({
        vehicleId: `VH-${v.id.toString().padStart(4, "0")}`,
        position: pos,
        tireId: `TR-${(v.id * 10 + idx).toString().padStart(4, "0")}`,
        treadDepth: 12 + Math.random() * 8,
        pressure: 80 + Math.random() * 40,
        temperature: 45 + Math.random() * 20,
        alertStatus: Math.random() > 0.2 ? "OK" : "Warning",
        recommendation:
          Math.random() > 0.2 ? "Normal operation" : "Monitor closely",
      })
    })
  })

  return {
    reportPeriod: `${dateRange.start} to ${dateRange.end}`,
    fleetSummary,
    vehiclePerformance,
    tireHealth,
  }
}

export const generateVehicleDetailData = (
  vehicle: VehicleData,
  dateRange: { start: string; end: string },
) => {
  const vehicleId = `VH-${vehicle.id.toString().padStart(4, "0")}`

  // Operating History
  const operatingHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(dateRange.end)
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split("T")[0],
      startTime: "08:00",
      endTime: "17:00",
      duration: 8 + Math.random() * 2,
      distance: 40 + Math.random() * 60,
      fuelUsed: 60 + Math.random() * 40,
      avgSpeed: 10 + Math.random() * 10,
      maxSpeed: 20 + Math.random() * 10,
      events: Math.random() > 0.8 ? "Hard brake x1" : "Normal",
    }
  })

  // Tire Analysis
  const positions =
    vehicle.tires === 4
      ? ["FL", "FR", "RL", "RR"]
      : ["FL", "FR", "RL1", "RR1", "RL2", "RR2"]
  const tireAnalysis = positions.map((pos, idx) => ({
    position: pos,
    tireId: `TR-${(vehicle.id * 10 + idx).toString().padStart(4, "0")}`,
    brand: ["Bridgestone", "Michelin", "Goodyear", "Continental"][
      Math.floor(Math.random() * 4)
    ],
    size: vehicle.tires === 4 ? "11R22.5" : "18.00R33",
    treadDepth: 12 + Math.random() * 8,
    pressure: 80 + Math.random() * 40,
    pressureStatus: Math.random() > 0.2 ? "OK" : "Warning",
    temperature: 45 + Math.random() * 20,
  }))

  // Maintenance
  const maintenance = [
    {
      serviceType: "250hr Service",
      dueDate: "2025-11-05",
      hoursUntilDue: 45,
      status: "Scheduled",
      notes: "Regular service",
    },
    {
      serviceType: "Hydraulic Check",
      dueDate: "2025-11-15",
      hoursUntilDue: 120,
      status: "Pending",
      notes: "Pressure test",
    },
  ]

  // Cost Analysis
  const costAnalysis = [
    "May 2025",
    "Jun 2025",
    "Jul 2025",
    "Aug 2025",
    "Sep 2025",
    "Oct 2025",
  ]
    .map((month) => ({
      month,
      fuel: 3500 + Math.random() * 1500,
      maintenance: 800 + Math.random() * 500,
      tires: 600 + Math.random() * 400,
      total: 0,
      costPerHour: 0,
    }))
    .map((item) => {
      item.total = item.fuel + item.maintenance + item.tires
      item.costPerHour = item.total / 160
      return item
    })

  // Performance Trends
  const performanceTrends = Array.from({ length: 12 }, (_, i) => {
    const weekNum = 31 + i
    return {
      week: `W${weekNum}`,
      operatingHours: 35 + Math.random() * 10,
      distance: 350 + Math.random() * 150,
      fuelEfficiency: 15 + Math.random() * 5,
      avgSpeed: 10 + Math.random() * 5,
      idlePercent: 0.15 + Math.random() * 0.1,
      score: 70 + Math.random() * 20,
    }
  })

  // Event Log
  const eventLog = [
    {
      dateTime: "2025-10-08 14:12",
      eventType: "System Warning",
      severity: "Low",
      description: "Tire pressure slightly low",
      location: "Site A, Zone 3",
      operator: "T. Tanaka",
      actionTaken: "None required",
    },
    {
      dateTime: "2025-10-21 09:30",
      eventType: "Maintenance Alert",
      severity: "Medium",
      description: "Service due soon",
      location: "Depot",
      operator: "H. Suzuki",
      actionTaken: "Logged",
    },
    {
      dateTime: "2025-09-30 16:45",
      eventType: "Long Idle",
      severity: "Low",
      description: "Idle time exceeded 30min",
      location: "Site B, Zone 1",
      operator: "M. Sato",
      actionTaken: "None required",
    },
  ]

  return {
    vehicleId,
    type: vehicle.model.includes("Excavator")
      ? "Excavator"
      : vehicle.model.includes("Dozer") || vehicle.model.includes("Bulldozer")
      ? "Bulldozer"
      : vehicle.model.includes("Loader")
      ? "Wheel Loader"
      : vehicle.model.includes("Crane")
      ? "Crane"
      : "Truck",
    model: vehicle.model.split(" ").slice(0, 2).join(" "),
    company: vehicle.company,
    reportGenerated: new Date().toISOString().split("T")[0],
    operatingHistory,
    tireAnalysis,
    maintenance,
    costAnalysis,
    performanceTrends,
    eventLog,
  }
}

export const exportFleetOverview = (
  vehicles: VehicleData[],
  dateRange: { start: string; end: string },
  format: ExportFormat,
) => {
  const data = generateFleetOverviewData(vehicles, dateRange)

  if (format === "csv") {
    // CSV: Export vehicle performance data
    const csv = convertToCSV(data.vehiclePerformance)
    downloadFile(csv, "Fleet_Overview.csv", "text/csv")
  } else {
    // XLSX: Create multi-sheet workbook matching the template structure
    const wb = XLSX.utils.book_new()

    // Fleet Overview Sheet
    const overviewData = [
      ["FLEET OVERVIEW"],
      [`Report Period: ${data.reportPeriod}`],
      [],
      ["Fleet Summary"],
      [
        "Company",
        "Total Vehicles",
        "Active",
        "Maintenance",
        "Idle",
        "Utilization %",
      ],
      ...data.fleetSummary.map((item) => [
        item.company,
        item.totalVehicles,
        item.active,
        item.maintenance,
        item.idle,
        (item.utilization * 100).toFixed(1) + "%",
      ]),
      [],
      [
        "TOTAL",
        data.fleetSummary.reduce((sum, item) => sum + item.totalVehicles, 0),
        data.fleetSummary.reduce((sum, item) => sum + item.active, 0),
        data.fleetSummary.reduce((sum, item) => sum + item.maintenance, 0),
        data.fleetSummary.reduce((sum, item) => sum + item.idle, 0),
        (
          (data.fleetSummary.reduce((sum, item) => sum + item.active, 0) /
            data.fleetSummary.reduce(
              (sum, item) => sum + item.totalVehicles,
              0,
            )) *
          100
        ).toFixed(1) + "%",
      ],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(wb, ws1, "Fleet Overview")

    // Vehicle Performance Sheet
    const perfData = [
      ["VEHICLE PERFORMANCE ANALYSIS"],
      [],
      [
        "Vehicle ID",
        "Type",
        "Model",
        "Operating Hours",
        "Distance (km)",
        "Fuel Used (L)",
        "Fuel Efficiency (L/hr)",
        "Idle Time (hrs)",
        "Idle %",
        "Speed (avg km/h)",
        "Load Factor",
        "Performance Score",
        "Status",
      ],
      ...data.vehiclePerformance.map((item) => [
        item.vehicleId,
        item.type,
        item.model,
        item.operatingHours,
        item.distance.toFixed(1),
        item.fuelUsed,
        item.fuelEfficiency.toFixed(1),
        item.idleTime.toFixed(1),
        (item.idlePercent * 100).toFixed(0) + "%",
        item.avgSpeed.toFixed(1),
        item.loadFactor.toFixed(3),
        item.performanceScore.toFixed(3),
        item.status,
      ]),
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(perfData)
    XLSX.utils.book_append_sheet(wb, ws2, "Vehicle Performance")

    // Tire Health Sheet
    const tireData = [
      ["TIRE HEALTH MONITORING REPORT"],
      [],
      [
        "Vehicle ID",
        "Tire Position",
        "Tire ID",
        "Tread Depth (mm)",
        "Pressure (PSI)",
        "Temp (°C)",
        "Alert Status",
        "Recommendation",
      ],
      ...data.tireHealth.map((item) => [
        item.vehicleId,
        item.position,
        item.tireId,
        item.treadDepth.toFixed(1),
        item.pressure.toFixed(0),
        item.temperature.toFixed(1),
        item.alertStatus,
        item.recommendation,
      ]),
    ]
    const ws3 = XLSX.utils.aoa_to_sheet(tireData)
    XLSX.utils.book_append_sheet(wb, ws3, "Tire Health")

    // Download
    XLSX.writeFile(wb, "Fleet_Overview.xlsx")
  }
}

export const exportVehicleDetail = (
  vehicle: VehicleData,
  dateRange: { start: string; end: string },
  format: ExportFormat,
) => {
  const data = generateVehicleDetailData(vehicle, dateRange)

  if (format === "csv") {
    // CSV: Export operating history
    const csv = convertToCSV(data.operatingHistory)
    downloadFile(csv, `Vehicle_Detail_${data.vehicleId}.csv`, "text/csv")
  } else {
    // XLSX: Create multi-sheet workbook
    const wb = XLSX.utils.book_new()

    // Vehicle Overview Sheet
    const overviewData = [
      [`VEHICLE DETAIL REPORT - ${data.vehicleId}`],
      [`Type: ${data.type} | Model: ${data.model}`],
      [`Report Generated: ${data.reportGenerated}`],
      [],
      ["VEHICLE INFORMATION"],
      [],
      ["Property", "Value"],
      ["Vehicle ID", data.vehicleId],
      ["Type", data.type],
      ["Model", data.model],
      ["Company", data.company],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(wb, ws1, "Vehicle Overview")

    // Operating History Sheet
    const historyData = [
      [`OPERATING HISTORY - ${data.vehicleId}`],
      [],
      [
        "Date",
        "Start Time",
        "End Time",
        "Duration (hrs)",
        "Distance (km)",
        "Fuel Used (L)",
        "Avg Speed (km/h)",
        "Max Speed (km/h)",
        "Events",
      ],
      ...data.operatingHistory.map((item) => [
        item.date,
        item.startTime,
        item.endTime,
        item.duration.toFixed(1),
        item.distance.toFixed(1),
        item.fuelUsed.toFixed(1),
        item.avgSpeed.toFixed(1),
        item.maxSpeed.toFixed(1),
        item.events,
      ]),
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(historyData)
    XLSX.utils.book_append_sheet(wb, ws2, "Operating History")

    // Tire Analysis Sheet
    const tireData = [
      [`TIRE CONDITION ANALYSIS - ${data.vehicleId}`],
      [],
      ["CURRENT TIRE STATUS"],
      [
        "Position",
        "Tire ID",
        "Brand",
        "Size",
        "Tread Depth (mm)",
        "Pressure (PSI)",
        "Pressure Status",
        "Temp (°C)",
      ],
      ...data.tireAnalysis.map((item) => [
        item.position,
        item.tireId,
        item.brand,
        item.size,
        item.treadDepth.toFixed(1),
        item.pressure.toFixed(0),
        item.pressureStatus,
        item.temperature.toFixed(1),
      ]),
    ]
    const ws3 = XLSX.utils.aoa_to_sheet(tireData)
    XLSX.utils.book_append_sheet(wb, ws3, "Tire Analysis")

    // Maintenance Sheet
    const maintenanceData = [
      [`MAINTENANCE RECORDS - ${data.vehicleId}`],
      [],
      ["UPCOMING MAINTENANCE SCHEDULE"],
      ["Service Type", "Due Date", "Hours Until Due", "Status", "Notes"],
      ...data.maintenance.map((item) => [
        item.serviceType,
        item.dueDate,
        item.hoursUntilDue,
        item.status,
        item.notes,
      ]),
    ]
    const ws4 = XLSX.utils.aoa_to_sheet(maintenanceData)
    XLSX.utils.book_append_sheet(wb, ws4, "Maintenance")

    // Cost Analysis Sheet
    const costData = [
      [`COST ANALYSIS - ${data.vehicleId}`],
      [],
      ["MONTHLY COST BREAKDOWN (Last 6 Months)"],
      [
        "Month",
        "Fuel ($)",
        "Maintenance ($)",
        "Tires ($)",
        "Total ($)",
        "Cost/Hour ($)",
      ],
      ...data.costAnalysis.map((item) => [
        item.month,
        item.fuel.toFixed(0),
        item.maintenance.toFixed(0),
        item.tires.toFixed(0),
        item.total.toFixed(0),
        item.costPerHour.toFixed(2),
      ]),
    ]
    const ws5 = XLSX.utils.aoa_to_sheet(costData)
    XLSX.utils.book_append_sheet(wb, ws5, "Cost Analysis")

    // Performance Trends Sheet
    const trendsData = [
      [`PERFORMANCE TRENDS - ${data.vehicleId}`],
      [],
      ["WEEKLY PERFORMANCE METRICS (Last 12 Weeks)"],
      [
        "Week",
        "Operating Hours",
        "Distance (km)",
        "Fuel Efficiency (L/hr)",
        "Avg Speed (km/h)",
        "Idle %",
        "Score",
      ],
      ...data.performanceTrends.map((item) => [
        item.week,
        item.operatingHours.toFixed(1),
        item.distance.toFixed(0),
        item.fuelEfficiency.toFixed(1),
        item.avgSpeed.toFixed(1),
        (item.idlePercent * 100).toFixed(1) + "%",
        item.score.toFixed(2),
      ]),
    ]
    const ws6 = XLSX.utils.aoa_to_sheet(trendsData)
    XLSX.utils.book_append_sheet(wb, ws6, "Performance Trends")

    // Event Log Sheet
    const eventData = [
      [`EVENT LOG - ${data.vehicleId}`],
      [],
      [
        "Date/Time",
        "Event Type",
        "Severity",
        "Description",
        "Location",
        "Operator",
        "Action Taken",
      ],
      ...data.eventLog.map((item) => [
        item.dateTime,
        item.eventType,
        item.severity,
        item.description,
        item.location,
        item.operator,
        item.actionTaken,
      ]),
    ]
    const ws7 = XLSX.utils.aoa_to_sheet(eventData)
    XLSX.utils.book_append_sheet(wb, ws7, "Event Log")

    // Download
    XLSX.writeFile(wb, `Vehicle_Detail_${data.vehicleId}.xlsx`)
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const rows = data.map((item) =>
    headers
      .map((header) => {
        const value = item[header]
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`
        }
        return value
      })
      .join(","),
  )

  return [headers.join(","), ...rows].join("\n")
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
