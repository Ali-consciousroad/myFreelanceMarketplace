import { UserRole } from "@prisma/client";

// Define the permissions for each role
export const rolePermissions = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageMissions: true,
    canManageContracts: true,
    canManagePayments: true,
    canAccessAdminPanel: true,
    canAccessSupportPanel: true,
  },
  [UserRole.SUPPORT]: {
    canManageUsers: false,
    canManageMissions: true,
    canManageContracts: true,
    canManagePayments: true,
    canAccessAdminPanel: false,
    canAccessSupportPanel: true,
  },
  [UserRole.CLIENT]: {
    canManageUsers: false,
    canManageMissions: true,
    canManageContracts: true,
    canManagePayments: true,
    canAccessAdminPanel: false,
    canAccessSupportPanel: false,
  },
  [UserRole.FREELANCER]: {
    canManageUsers: false,
    canManageMissions: false,
    canManageContracts: true,
    canManagePayments: false,
    canAccessAdminPanel: false,
    canAccessSupportPanel: false,
  },
};

// Type for the permissions
export type Permission = keyof typeof rolePermissions[UserRole.ADMIN];

// Function to check if a user has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.[permission] || false;
}

// Function to check if a user has any of the given permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Function to check if a user has all of the given permissions
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Function to get all permissions for a role
export function getRolePermissions(role: UserRole): Record<Permission, boolean> {
  return rolePermissions[role] || {};
} 