import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CompaniesGetQuery,
  CompaniesGetResponse,
  CompanyCreateBody,
  CompanyCreateResponse,
  CompanyGetQuery,
  CompanyGetResponse,
  CompanyUpdateBody,
  CompanyDeleteQuery,
  CompanyDeleteResponse,
  CompanyRestoreQuery,
  CompanyRestoreResponse,
  CompanyUpdateQuery,
  CompanyUpdateResponse,
  CompanyVerifyBody,
  CompanyVerifyQuery,
  CompanyVerifyResponse,
  CompanyVehiclesQuery,
  CompanyVehiclesReponse,
} from '@/types/features/companies/company.types'
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  restoreCompany,
  getCompany,
  verifyCompany,
  getCompanyVehicles,
} from '../actions/compnay.actions'
import type { ServerActionResult } from '@/types/features/common.types'
import type { ApiParamsType } from '@/types/features'
import { vehiclesApi } from '../api/vehicle'

export function useAllCompanies(query: CompaniesGetQuery) {
  return useQuery({
    queryKey: ['companies', query],
    queryFn: async () => {
      const result = await getAllCompanies(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCompanyById(id: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const result = await getCompany({ id })

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<CompanyCreateResponse>,
    Error,
    CompanyCreateBody
  >({
    mutationFn: async (newCompany) => {
      const res = await createCompany(newCompany)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      if (res.success) {
        toast.success('A new company added', {
          description: `${res.data.name}`,
          position: 'bottom-center',
        })
      }
    },
    onError: (error) => {
      toast.error('Adding a new company failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<CompanyDeleteResponse>,
    Error,
    CompanyDeleteQuery
  >({
    mutationFn: async (deleteParams) => {
      const res = await deleteCompany(deleteParams)
      return res
    },
    onSuccess: (res) => {
      // 회사 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })

      if (res.success) {
        toast.success('A company deleted.', {
          position: 'bottom-center',
        })
      }
    },
    onError: (error) => {
      toast.error('Deleting a comapny failed.', {
        position: 'bottom-center',
      })
      logger.error('Delete company error:', error)
    },
  })
}

export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<CompanyUpdateResponse>,
    Error,
    CompanyUpdateBody
  >({
    mutationFn: async (newCompany) => {
      const res = await updateCompany({ id }, newCompany)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      queryClient.invalidateQueries({
        queryKey: ['company', id],
      })
      if (res.success) {
        toast.success('Company updated', {
          description: `${res.data.name}`,
          position: 'bottom-center',
        })
      }
    },
    onError: (error) => {
      toast.error('Update failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useRestoreCompany() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<CompanyRestoreResponse>,
    Error,
    CompanyRestoreQuery
  >({
    mutationFn: async (restoreParams) => {
      const res = await restoreCompany(restoreParams)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      if (res.success) {
        toast.success(res.message ?? 'Company restored.', {
          position: 'bottom-center',
        })
      }
    },
    onError: (error) => {
      toast.error('Restoring a company failed.', {
        position: 'bottom-center',
      })
      logger.error('Restore vehicle error:', error)
    },
  })
}

export function useVerifyCompany(id: string) {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<CompanyVerifyResponse>,
    Error,
    CompanyVerifyBody
  >({
    mutationFn: async (body) => {
      const res = await verifyCompany({ id }, body)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      queryClient.invalidateQueries({
        queryKey: ['company', id],
      })
      if (res.success) {
        toast.success('Company Verification Complete', {
          description: `${res.data.name}`,
          position: 'bottom-center',
        })
      }
    },
    onError: (error) => {
      toast.error('Company Verification Failed', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useCompanyVehicles(query: CompanyVehiclesQuery) {
  return useQuery({
    queryKey: ['vehicles', query],
    queryFn: async () => {
      const result = await getCompanyVehicles(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
