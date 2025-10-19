import ActiveVehiclesContent from '@/components/features/active-vehicles/active-vehicles-content'

export default async function ActiveVehiclesPage() {
  return (
    <div className="page-container">
      <h1 className="header-one">Active Vehicles</h1>
      <div className="w-full">
        <ActiveVehiclesContent />
      </div>
    </div>
  )
}
