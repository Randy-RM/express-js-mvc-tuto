import { ROLES, Role } from "../constants";
import { IUser } from "../types";

export function isRoleExist(role: string): role is Role {
  return ([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER] as string[]).includes(role);
}

export function isAllowedToManipulate(
  resourceOwnerId: string | object,
  connectedUser: IUser
): boolean {
  const { _id: loggedUserId, role: loggedUserRole } = connectedUser;
  if (String(resourceOwnerId) !== String(loggedUserId)) {
    if (loggedUserRole !== ROLES.ADMIN) {
      return false;
    }
  }
  return true;
}
