import { GearType, FuelType } from '@/constants/enums/vehicle.enum'
import { CompanyType } from '@/constants/enums/company.enum'
import { SensorStatus } from '@/constants/enums/sensor.enum'
import { EdgeDeviceType } from '@/constants/enums/edge-device.enum'

type a = {
  data: [
    {
      id: number
      createdAt: string
      updatedAt: string
      vehicleName: string
      plateNumber: string
      brand: string
      model: string
      manufactureYear: number
      canBitrate: string
      fuelType: FuelType
      gearType: GearType
      numTire: number
      isdeleted: boolean
      users: {
        id: number
        name: string
        username: string
        email: string
        verified: boolean
        isdeleted: boolean
      }[]
      tires: {
        id: number
        tireLocation: string
        profiler: {
          id: number
          serialNumber: string
          profilerFwVer: string
          profilerRev: string
          verified: boolean
          isdeleted: boolean
          status: SensorStatus
        }
        sensor: {
          id: 1
          serialNumber: string
          sensorFwVer: string
          sensorRev: string
          verified: boolean
          isdeleted: boolean
          status: SensorStatus
        }
      }[]
      edgeDevices: {
        id: number
        name: string
        serialNumber: string
        type: EdgeDeviceType
        wlanIpAddr: string
        ethIpAddr: string
        verified: boolean
        terminated: boolean
        terminatedAt?: string
      }[]
      company: {
        id: number
        name: string
        regNumber: string
        type: CompanyType
        website: string
        verified: boolean
        isdeleted: boolean
      }
    },
  ]
  pagination: {
    page: 1
    limit: 20
    total: 1
    totalPages: 1
  }
}
