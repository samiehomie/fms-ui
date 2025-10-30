// TODO 목업 데이터를 위해 타입 정의를 선행함
// TODO 이미 선언한 타입과 총돌 가능성이 높음 이를 확인 할 것

export enum VehicleType {
  EXCAVATOR = "excavator",
  BULLDOZER = "bulldozer",
  DUMP_TRUCK = "dump_truck",
  WHEEL_LOADER = "wheel_loader",
  CRANE = "crane",
  GRADER = "grader",
}

export enum VehicleStatus {
  ACTIVE = "active",
  MAINTENANCE = "maintenance",
  IDLE = "idle",
  RETIRED = "retired",
}

export enum AlertPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum TirePosition {
  FL = "FL", // Front Left
  FR = "FR", // Front Right
  RL = "RL", // Rear Left
  RR = "RR", // Rear Right
  RL1 = "RL1", // Rear Left 1 (for multi-axle)
  RR1 = "RR1", // Rear Right 1
  RL2 = "RL2", // Rear Left 2
  RR2 = "RR2", // Rear Right 2
  RL3 = "RL3", // Rear Left 3
  RR3 = "RR3", // Rear Right 3
  RL4 = "RL4", // Rear Left 4
  RR4 = "RR4", // Rear Right 4
}
