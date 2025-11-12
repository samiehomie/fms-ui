"use client"

import { useState } from "react"
import CompanyVehiclesContent from "@/components/features/companies/vehicles/company-vehicles-content"
import SubSidebar from "./sub-sidebar"

export type NavItems = "Company" | "Users" | "Vehicles" | "Devices"

export default function CompanyDetails({ companyId }: { companyId: string }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState<NavItems>("Company")

  return (
    <div className="flex flex-1">
      <SubSidebar
        isCollapsed={isSidebarCollapsed}
        activeNavItem={activeNavItem}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        setActiveNavItem={setActiveNavItem}
      />
      <div className="flex-1 flex flex-col pl-[1.8rem] pt-5 pb-10">
        {activeNavItem === "Vehicles" && (
          <CompanyVehiclesContent companyId={companyId} />
        )}
        {/* {activeNavItem === 'Company' && (
          <CompanyDetailContent
            company={detail.company}
            handleClick={() => setActiveNavItem('Vehicles')}
          />
        )} */}
      </div>
    </div>
  )
}
