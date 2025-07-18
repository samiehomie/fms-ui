import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/company'
import type { CompaniesPaginationParams } from '@/types/api/company.types'
import { ApiResponseType, ApiRequestType, ApiParamsType } from '@/types/api'
import { toast } from 'sonner'
import { vehiclesApi } from '@/lib/api/vehicle'

type CreateCompanyResponse = ApiResponseType<'POST /companies'>
type CreateCompanyRequest = ApiRequestType<'POST /companies'>
type DeleteCompanyResponse = ApiResponseType<'DELETE /companies'>
type ModifyCompanyResponse = ApiResponseType<'PUT /companies'>
type ModifyCompanyRequest = ApiRequestType<'PUT /companies'>
type VerifyCompanyRequest = ApiRequestType<'PATCH /companies/{id}/verify'>
type VerifyCompanyRespone = ApiResponseType<'PATCH /companies/{id}/verify'>

export function useCompaniesPaginated(params: CompaniesPaginationParams) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.getCompaniesPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCompanyById(id: number) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companiesApi.getCompanyById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation<CreateCompanyResponse, Error, CreateCompanyRequest>({
    mutationFn: async (newCompany) => {
      const { data } = await companiesApi.createCompany(newCompany)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      toast.success('A new company added', {
        description: `${data.company.name}`,
        position: 'bottom-center',
      })
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
  return useMutation<DeleteCompanyResponse, Error, number>({
    mutationFn: async (companyId) => {
      const { data } = await companiesApi.deleteCompany(companyId)
      return data
    },
    onSuccess: (data, companyId) => {
      // 특정 회사 쿼리 제거
      queryClient.removeQueries({
        queryKey: ['companies', companyId],
      })
      // 회사 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      toast.success('A company deleted.', {
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Deleting a comapny failed.', {
        position: 'bottom-center',
      })
      console.error('Delete company error:', error)
    },
  })
}

export function useModifyCompany(id: number) {
  const queryClient = useQueryClient()
  return useMutation<ModifyCompanyResponse, Error, ModifyCompanyRequest>({
    mutationFn: async (newCompany) => {
      const { data } = await companiesApi.modifyCompany(id, newCompany)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      toast.success('A new company added', {
        description: `${data.company.name}`,
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Adding a new company failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useVerifyCompany(id: number) {
  const queryClient = useQueryClient()
  return useMutation<VerifyCompanyRespone, Error, VerifyCompanyRequest>({
    mutationFn: async (newCompany) => {
      const { data } = await companiesApi.verifyCompany(id, newCompany)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
      toast.success('Company Verification Complete', {
        description: `${data.company.name}`,
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Company Verification Failed', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useCompanyVehiclesPaginated(
  companyId: number,
  params: ApiParamsType<'GET /vehicles/company/{company_id}'>,
) {
  return useQuery({
    queryKey: ['vehicles', params, companyId],
    queryFn: () =>
      vehiclesApi.getVehiclesByCompanyIdPaginated(params, companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
