import { Skeleton } from '@/components/ui/skeleton'

export default function VehiclesLoading() {
  return (
    <div>
      <Skeleton className="w-full h-[3.9063rem] mb-10" />
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  )
}
