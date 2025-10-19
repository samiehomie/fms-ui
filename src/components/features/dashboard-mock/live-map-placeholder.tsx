import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, MapPin, Navigation } from "lucide-react"

export function LiveMapPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Live Vehicle Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] bg-gray-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-4">
              <MapPin className="h-8 w-8 text-blue-500" />
              <Navigation className="h-8 w-8 text-green-500" />
              <MapPin className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Real-time Vehicle Map
              </h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md">
                This section will display a live map showing the current
                locations and status of all fleet vehicles. Features will
                include:
              </p>
              <ul className="text-xs text-gray-500 mt-3 space-y-1 text-left max-w-sm">
                <li>• Real-time vehicle positions</li>
                <li>• Vehicle status indicators</li>
                <li>• Route tracking and history</li>
                <li>• Geofencing alerts</li>
                <li>• Driver information on click</li>
              </ul>
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 px-3 py-2 rounded">
              Map implementation placeholder
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
