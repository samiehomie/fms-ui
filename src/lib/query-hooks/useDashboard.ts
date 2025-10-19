import { useAllCompanies } from './useCompanies'
import { useAllVehicles } from './useVehicles'
import { useUsersPaginated } from './useUsers'
import { useDevicesPaginated } from './useDevices'

const paramsAllData = {
  page: 1,
  limit: 10000,
}

export const useDashboard = () => {
  const companiesQuery = useAllCompanies({
    page: 1,
    limit: 6,
  })
  const vehiclesQuery = useAllVehicles(paramsAllData)
  const usersQuery = useUsersPaginated(paramsAllData)
  const devicesQuery = useDevicesPaginated(paramsAllData)

  return {
    companies: companiesQuery.data,
    vehicles: vehiclesQuery.data,
    users: usersQuery.data,
    devices: devicesQuery.data,

    isLoading: [companiesQuery, vehiclesQuery, usersQuery, devicesQuery].some(
      (query) => query.isPending,
    ),
  }
}
