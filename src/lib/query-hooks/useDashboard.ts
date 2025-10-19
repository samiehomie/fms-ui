import { useAllCompanies } from './useCompanies'
import { useAllVehicles } from './useVehicles'
import { useAllUsers } from './useUsers'

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
  const usersQuery = useAllUsers(paramsAllData)

  return {
    companies: companiesQuery.data,
    vehicles: vehiclesQuery.data,
    users: usersQuery.data,

    isLoading: [companiesQuery, vehiclesQuery, usersQuery].some(
      (query) => query.isPending,
    ),
  }
}
