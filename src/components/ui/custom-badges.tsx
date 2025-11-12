import { IconCircleCheckFilled } from "@tabler/icons-react"
import { CircleSlash } from "lucide-react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils/utils"

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-muted-foreground px-1.5", className)}
    >
      <IconCircleCheckFilled className="fill-green-500" />
      {`Verified`}
    </Badge>
  )
}

export function UnVerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-muted-foreground px-1.5", className)}
    >
      <CircleSlash className="stroke-gray-500  " />
      {`Not yet`}
    </Badge>
  )
}
