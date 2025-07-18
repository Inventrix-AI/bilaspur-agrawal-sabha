export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  COMMITTEE_ADMIN = "Committee Admin", 
  MEMBER = "Member"
}

export enum Permission {
  MANAGE_MEMBERS = "manage_members",
  MANAGE_EVENTS = "manage_events",
  MANAGE_NEWS = "manage_news",
  MANAGE_COMMITTEES = "manage_committees",
  MANAGE_GALLERY = "manage_gallery",
  MANAGE_USERS = "manage_users",
  ACCESS_ADMIN_PANEL = "access_admin_panel",
  APPROVE_MATRIMONIAL = "approve_matrimonial"
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.MANAGE_MEMBERS,
    Permission.MANAGE_EVENTS,
    Permission.MANAGE_NEWS,
    Permission.MANAGE_COMMITTEES,
    Permission.MANAGE_GALLERY,
    Permission.MANAGE_USERS,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.APPROVE_MATRIMONIAL
  ],
  [UserRole.COMMITTEE_ADMIN]: [
    Permission.MANAGE_EVENTS,
    Permission.MANAGE_GALLERY,
    Permission.ACCESS_ADMIN_PANEL
  ],
  [UserRole.MEMBER]: []
}

export function hasPermission(userRole: string, permission: Permission): boolean {
  const role = userRole as UserRole
  return rolePermissions[role]?.includes(permission) || false
}

export function canAccessAdminPanel(userRole: string): boolean {
  return hasPermission(userRole, Permission.ACCESS_ADMIN_PANEL)
}

export function isAdmin(userRole: string): boolean {
  return userRole === UserRole.SUPER_ADMIN || userRole === UserRole.COMMITTEE_ADMIN
}