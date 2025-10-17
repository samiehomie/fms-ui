import { BaseEntity } from './base.entity'
import { Vehicle } from './vehicle.entity'
import { SmartProfiler } from './smart-profiler.entity'
import { AiResult } from './ai-result.entity'
import { TpmsResult } from './tpms-result.entity'
import { Sensor } from './sensor.entity'
import { RawDataFile } from './raw-data-file.entity'

export interface Tire extends BaseEntity {
  profiler: SmartProfiler

  sensor: Sensor

  tireLocation: string

  vehicle: Vehicle

  aiResults: AiResult[]

  rawDataFiles: RawDataFile[]

  tpmsResults: TpmsResult[]
}
