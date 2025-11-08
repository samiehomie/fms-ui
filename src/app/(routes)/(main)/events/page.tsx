"use client"

import { useState } from "react"
import { TripMonitor } from "@/components/features/events/trip-monitor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"

export default function TripDetailPage() {
  const [inputValue, setInputValue] = useState("0")
  const [tripId, setTripId] = useState<number | null>(null)
  const [error, setError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const parsedId = parseInt(inputValue, 10)

    if (isNaN(parsedId) || parsedId < 0) {
      setError("Trip ID must be a valid non-negative number.")
      return
    }

    setTripId(parsedId)
  }

  if (tripId === null) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg border p-6">
            <h1 className="text-2xl font-bold mb-6">Trip Monitor</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Field>
                <FieldLabel htmlFor="tripId">Trip ID</FieldLabel>
                <FieldContent>
                  <Input
                    id="tripId"
                    type="number"
                    placeholder="Enter trip ID"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    min="0"
                  />
                  {error && <FieldError>{error}</FieldError>}
                </FieldContent>
              </Field>
              <Button type="submit" className="w-full">
                Start Monitor
              </Button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8">
      <TripMonitor tripId={tripId} vehicleId={1} />
    </main>
  )
}
