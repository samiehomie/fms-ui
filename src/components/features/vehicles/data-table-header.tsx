'ues client'
import { useState, FC } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AddVehicleForm } from './add-vehicle-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tag } from 'antd'
import type { VehiclesGetQuery } from '@/types/features/vehicle/vehicle.types'

type DataTableHeaderProps = {
  pagination: VehiclesGetQuery
  setPagination: React.Dispatch<React.SetStateAction<VehiclesGetQuery>>
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
          placeholder="Search in vehicle name, model, or plate number"
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
            checked={pagination.includeDeleted}
            onCheckedChange={(e) => {
              setPagination((old) => ({
                ...old,
                includeDeleted: !old.includeDeleted,
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
