import CompaniesContent from '@/components/features/companies/companies-content'

export default async function CompaniesPage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold tracking-tight">Companies</h1>
      <p className=" tracking-tight text-[15px] font-[400] mt-2">
        Manage companies in your fleet management system
      </p>
      <div className="container mx-auto my-10 ">
        <CompaniesContent />
      </div>
    </div>
  )
}
