// Define user roles as constants
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];