import ActiveVehiclesContent from '@/components/features/active-vehicles/active-vehicles-content'

export default async function ActiveVehiclesPage() {
  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold tracking-tight">Active Vehicles</h1>
      <p className="tracking-tight text-[15px] font-[400] mt-2">
        Real-time vehicle monitoring and data tracking
      </p>
      <div className="w-full mx-auto my-10">
        <ActiveVehiclesContent />
      </div>
    </div>
  )
}