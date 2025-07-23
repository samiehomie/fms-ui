import { useCompaniesPaginated } from './useCompanies'
import {
  useVehiclesPaginated,
  useAllVehicleTripsPaginated,
} from './useVehicles'
import { useUsersPaginated } from './useUsers'
import { useDevicesPaginated } from './useDevices'

const paramsAllData = {
  page: 1,
  limit: 10000,
}

export const useDashboard = () => {
  const companiesQuery = useCompaniesPaginated({
    page: 1,
    limit: 6,
  })
  const vehiclesQuery = useVehiclesPaginated(paramsAllData)
  const usersQuery = useUsersPaginated(paramsAllData)
  const devicesQuery = useDevicesPaginated(paramsAllData)
  const activeTripsQuery = useAllVehicleTripsPaginated({
    status: 'active',
  })

  return {
    companies: companiesQuery.data,
    vehicles: vehiclesQuery.data,
    users: usersQuery.data,
    devices: devicesQuery.data,
    activeTrips: activeTripsQuery.data,
    isLoading: [
      companiesQuery,
      vehiclesQuery,
      usersQuery,
      devicesQuery,
      activeTripsQuery,
    ].some((query) => query.isPending),
  }
}
