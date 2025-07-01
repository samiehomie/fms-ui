import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/company'
import type { CompaniesPaginationParams } from '@/types/api/company.types'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import { toast } from 'sonner'

type CreateCompanyResponse = ApiResponseType<'POST /companies'>
type CreateCompanyRequest = ApiRequestType<'POST /companies'>
type DeleteCompanyResponse = ApiResponseType<'DELETE /companies'>
type DeleteCompanyRequest = ApiRequestType<'DELETE /companies'>

export function useCompaniesPaginated(params: CompaniesPaginationParams) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.getCompaniesPaginated(params),
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
      toast.success('회사가 성공적으로 삭제되었습니다.', {
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('회사 삭제에 실패했습니다.', {
        position: 'bottom-center',
      })
      console.error('Delete company error:', error)
    },
  })
}
