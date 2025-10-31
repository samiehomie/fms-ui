"ues client"
import { useState, type FC } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tag } from "antd"
import type { VehiclesGetQuery } from "@/types/features/vehicles/vehicle.types"
import DateRangePicker from "@/components/ui/data-range-picker"

type DataTableHeaderProps = {
  pagination: VehiclesGetQuery
  setPagination: React.Dispatch<React.SetStateAction<VehiclesGetQuery>>
}

const DataTableHeader: FC<DataTableHeaderProps> = ({
  pagination,
  setPagination,
}) => {
  const [search, setSearch] = useState("")

  const handleSearch = () => {
    setPagination((old) => ({ ...old, search }))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }
  return (
    <div className="flex items-center justify-between gap-x-4">
      <div className="flex items-center gap-x-2 ">
        <DateRangePicker className="mr-3" />
        <Input
          placeholder="Search in vehicle name, model, or plate number"
          value={search}
          onChange={(event) => {
            //setPagination((old) => ({ ...old, search: event.target.value }))
            setSearch(event.target.value)
            // table.getColumn('name')?.setFilterValue(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          className="min-w-[370px]"
        />
        <Button
          variant={"outline"}
          onClick={handleSearch}
          className="px-2 text-[.811rem] font-normal"
        >
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
                  search: "",
                }))
                setSearch("")
              }}
              closable={true}
            >
              {pagination.search}
            </Tag>
          )}
        </div>
      </div>
      <ul className="text-xs font-medium text-center rounded-md flex shadow-sm">
        <li className="w-full focus-within:z-10">
          <button
            className="inline-block w-full py-2 px-3 text-slate-900 bg-slate-50 border-r 
          border-slate-300 rounded-s-md  focus:outline-none whitespace-nowrap"
          >{`Fleet Overview`}</button>
        </li>
        <li className="w-full focus-within:z-10">
          <button
            className=" inline-block w-full py-2 px-3 text-slate-500 bg-white border-s-0 
          border-slate-300 rounded-e-md  focus:outline-none"
          >{`Vehicle Detail`}</button>
        </li>
      </ul>
    </div>
  )
}

export default DataTableHeader
