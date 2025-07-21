'use client'

import { Fragment } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import { capitalizeFirstLetter } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function BreadcrumbMain() {
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

  logger.log('test-2')
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.slice(0, segments.length - 1).map((segment, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/${segment}`}>
                {capitalizeFirstLetter(segment)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {capitalizeFirstLetter(segments[segments.length - 1])}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
