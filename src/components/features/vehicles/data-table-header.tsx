'ues client'
import { useState, FC } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AddVehicleForm } from './add-vehicle-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ApiParamsType } from '@/types/api'
import type { CompaniesPaginationParams } from '@/types/api/company.types'
import { Tag, Switch } from 'antd'

type DataTableHeaderProps = {
  pagination: ApiParamsType<'GET /vehicles'> & CompaniesPaginationParams
  setPagination: React.Dispatch<
    React.SetStateAction<
      ApiParamsType<'GET /vehicles'> & CompaniesPaginationParams
    >
  >
}

const DataTableHeader: FC<DataTableHeaderProps> = ({
  pagination,
  setPagination,
}) => {
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    setPagination((old) => ({ ...old, search }))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }
  return (
    <div className="flex items-center justify-between gap-x-4">
      <div className="flex items-center gap-x-2 ">
        <Input
          placeholder="Search in company name, reg number, or email"
          value={search}
          onChange={(event) => {
            //setPagination((old) => ({ ...old, search: event.target.value }))
            setSearch(event.target.value)
            // table.getColumn('name')?.setFilterValue(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          className="min-w-[400px]"
        />
        <Button variant={'outline'} onClick={handleSearch}>
          Search
        </Button>
        <div className="ml-2">
          {pagination.search && (
            <Tag
              color="processing"
              className="ml-3"
              bordered={false}
              onClose={() => {
                setPagination((old) => ({
                  ...old,
                  search: '',
                }))
                setSearch('')
              }}
              closable={true}
            >
              {pagination.search}
            </Tag>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-[.9rem] py-2 px-3 rounded-sm bg-slate-50/80  border border-slate-300/80 ">
        <div className="flex items-center gap-1">
          <Checkbox
            id="terms"
            checked={pagination.include_deleted}
            onCheckedChange={(e) => {
              setPagination((old) => ({
                ...old,
                include_deleted: !old.include_deleted,
              }))
            }}
          />
          <Label
            htmlFor="terms"
            className="font-[400]"
          >{`Include deleted`}</Label>
        </div>
        <AddVehicleForm />
      </div>
    </div>
  )
}

export default DataTableHeader
