import DevicesContent from '@/components/features/devices/devices-content'

export default async function CompaniesPage() {
  return (
    <div className="page-container">
      <h1 className="header-one">Devices</h1>
      <div className="w-full">
        <DevicesContent />
      </div>
    </div>
  )
}
