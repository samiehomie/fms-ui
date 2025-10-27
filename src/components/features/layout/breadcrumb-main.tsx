"use client"

import { Fragment } from "react"
import { useSelectedLayoutSegments } from "next/navigation"
import { capitalizeFirstLetter } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BreadcrumbMain() {
  const onlyCapitalRoutes = ["tpms"]
  const segments = useSelectedLayoutSegments()

  if (!segments) return null

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
  const segmentsIndex = segments.length - 1
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.slice(0, segmentsIndex).map((segment, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/${segment}`}>
                {onlyCapitalRoutes.includes(segment)
                  ? segment.toUpperCase()
                  : capitalizeFirstLetter(segment)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {onlyCapitalRoutes.includes(segments[segmentsIndex])
              ? segments[segmentsIndex].toUpperCase()
              : capitalizeFirstLetter(segments[segmentsIndex])}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
