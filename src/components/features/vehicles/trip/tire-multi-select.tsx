'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TireMultiSelectProps {
  tireLocations: string[]
  selectedTires: string[]
  onSelectionChange: (tires: string[]) => void
}

export function TireMultiSelect({
  tireLocations,
  selectedTires,
  onSelectionChange,
}: TireMultiSelectProps) {
  const isShowAll = selectedTires.includes('all')

  const handleShowAllToggle = () => {
    if (isShowAll) {
      onSelectionChange([tireLocations[0]])
    } else {
      onSelectionChange(['all'])
    }
  }

  const handleTireToggle = (tireValue: string) => {
    if (isShowAll) {
      onSelectionChange([tireValue])
    } else {
      if (selectedTires.includes(tireValue)) {
        const newSelection = selectedTires.filter((t) => t !== tireValue)
        onSelectionChange(newSelection.length === 0 ? ['all'] : newSelection)
      } else {
        onSelectionChange([...selectedTires, tireValue])
      }
    }
  }

  const getDisplayText = () => {
    if (isShowAll) return 'Show All'
    if (selectedTires.length === 1) {
      const tire = tireLocations.find((t) => t === selectedTires[0])
      return tire || 'Select Tires'
    }
    return `${selectedTires.length} Tires Selected`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[120px] h-4 text-[12px] rounded-none font-[300]"
        >
          {getDisplayText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[120px] text-[12px]">
        <DropdownMenuCheckboxItem
          checked={isShowAll}
          className="text-[12px]"
          onCheckedChange={handleShowAllToggle}
        >
          Show All
        </DropdownMenuCheckboxItem>
        <div className="my-[2px] h-px bg-border" />
        {tireLocations.map((tire) => (
          <DropdownMenuCheckboxItem
            key={tire}
            className="text-[12px]"
            checked={!isShowAll && selectedTires.includes(tire)}
            onCheckedChange={() => handleTireToggle(tire)}
          >
            {tire}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
