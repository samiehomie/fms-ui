import CompaniesContent from '@/components/features/companies/companies-content'

export default async function CompaniesPage() {
  return (
    <div className="page-container">
      <h1 className="header-one">Companies</h1>
      <div className="w-full">
        <CompaniesContent />
      </div>
    </div>
  )
}
