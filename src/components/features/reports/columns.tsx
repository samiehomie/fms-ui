"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDateTime } from "@/lib/utils/date-formatter"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import {
  useDeleteVehicle,
  useRestoreVehicle,
} from "@/lib/query-hooks/use-vehicles"
import type { VehiclesGetResponse } from "@/types/features/vehicles/vehicle.types"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<VehiclesGetResponse[number]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mr-3.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className=""
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="mr-2.5">{"ID"}</div>,
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },

  {
    id: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company
      return <div>{company.name}</div>
    },
  },
  {
    accessorKey: "vehicleName",
    header: "Name",
  },
  {
    accessorKey: "plateNumber",
    header: "Plate No.",
  },

  {
    id: "vehicle_info",
    header: "Model",
    cell: ({ row }) => {
      const { model, brand, manufactureYear, fuelType, gearType } = row.original
      return (
        <div className="flex gap-1">
          <div className="font-[400]">
            {brand} {model}
            <span className="text-muted-foreground pl-1 font-normal">
              {manufactureYear} {gearType} {fuelType}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "canBitrate",
    header: "Can Bitrate",
  },
  {
    accessorKey: "numTire",
    header: "Tires",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created at
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="flex justify-center tracking-tight">
          {formatDateTime(createdAt)}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter()
      const { isdeleted, id: vehicleId } = row.original
      const mutationDelete = useDeleteVehicle()
      const mutationRestore = useRestoreVehicle()

      const [open, setOpen] = useState(false)

      const handleDeleteAction = async () => {
        try {
          await mutationDelete.mutateAsync({
            id: vehicleId.toString(),
          })
          setOpen(false) // 메뉴 닫기
        } catch (error) {
          logger.error("Delete action failed:", error)
        }
      }

      const handleRestoreAction = async () => {
        try {
          await mutationRestore.mutateAsync({
            id: vehicleId.toString(),
          })
          setOpen(false) // 메뉴 닫기
        } catch (error) {
          logger.error("Restore action failed:", error)
        }
      }

      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => {
                router.push(`/vehicles/${vehicleId}`)
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              onClose={() => setOpen(false)}
              handleClick={
                !isdeleted ? handleDeleteAction : handleRestoreAction
              }
            >
              <div
                className={cn(
                  "text-sm p-2 text-red-500 hover:bg-gray-100/90 rounded-sm",
                  isdeleted && "text-blue-500",
                )}
              >
                {isdeleted ? "Restore" : "Delete"}
              </div>
            </ConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  // 숨겨진 열 (스타일링용)
  {
    id: "isDeleted",
    accessorKey: "isdeleted", // 실제 데이터 키
    header: "isDeleted",
  },
]
