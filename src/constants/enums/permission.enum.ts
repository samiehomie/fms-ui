export enum Permission {
  // 차량 관련
  VEHICLE_CREATE = 'vehicle:create',
  VEHICLE_READ = 'vehicle:read',
  VEHICLE_UPDATE = 'vehicle:update',
  VEHICLE_DELETE = 'vehicle:delete',

  // 사용자 관련
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // 정비 관련
  MAINTENANCE_CREATE = 'maintenance:create',
  MAINTENANCE_READ = 'maintenance:read',
  MAINTENANCE_UPDATE = 'maintenance:update',
  MAINTENANCE_DELETE = 'maintenance:delete',

  // 결제 관련
  BILLING_MANAGE = 'billing:manage',
  BILLING_VIEW = 'billing:view',

  // 플랫폼 관리
  PLATFORM_MANAGE = 'platform:manage',
  COMPANY_MANAGE = 'company:manage',
}
