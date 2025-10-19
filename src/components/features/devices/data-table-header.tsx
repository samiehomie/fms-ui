'ues client'
import { useState, FC } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AddDeviceForm } from './add-device-form'
import { Tag, Switch } from 'antd'
import type { DevicesGetQuery } from '@/types/features/device/device.types'

type DataTableHeaderProps = {
  query: DevicesGetQuery
  setQuery: React.Dispatch<React.SetStateAction<DevicesGetQuery>>
}

const DataTableHeader: FC<DataTableHeaderProps> = ({ query, setQuery }) => {
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    setQuery((old) => ({ ...old, search }))
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
        {/* <div className="ml-2">
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
        </div> */}
      </div>
      <div className="flex items-center gap-x-[.625rem] py-2 px-2 rounded-sm bg-slate-50/80  border border-slate-300/80 ">
        <Switch
          size={'default'}
          checkedChildren="verified"
          unCheckedChildren="unverified"
          checked={query.verified}
          onChange={() => {
            setQuery((old) => ({
              ...old,
              verified: !old.verified,
            }))
          }}
        />
        <AddDeviceForm />
      </div>
    </div>
  )
}

export default DataTableHeader
