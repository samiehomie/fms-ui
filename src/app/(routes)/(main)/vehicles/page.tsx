import VehiclesContent from '@/components/features/vehicles/vehicles-content'

export default async function VehiclesPage() {
  return (
    <div className="page-container">
      <h1 className="header-one">Vehicles</h1>
      <div className="w-full mx-auto ">
        <VehiclesContent />
      </div>
    </div>
  )
}
