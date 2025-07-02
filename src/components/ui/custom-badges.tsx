import { IconCircleCheckFilled } from '@tabler/icons-react'
import { CircleSlash } from 'lucide-react'
import { Badge } from './badge'

export function VerifiedBadge() {
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      <IconCircleCheckFilled className="fill-green-500" />
      {`Verified`}
    </Badge>
  )
}

export function UnVerifiedBadge() {
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      <CircleSlash className="stroke-gray-500  " />
      {`Not yet`}
    </Badge>
  )
}
