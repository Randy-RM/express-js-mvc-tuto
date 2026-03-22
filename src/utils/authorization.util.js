const { ROLES } = require("../constants");

function isRoleExist(role) {
  return [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER].includes(role);
}

function isAllowedToManipulate(resourceOwnerId, connectedUser) {
  const { id: loggedUserId, role: loggedUserRole } = connectedUser;
  if (String(resourceOwnerId) !== String(loggedUserId)) {
    if (loggedUserRole !== ROLES.ADMIN) {
      return false;
    }
  }
  return true;
}

module.exports = {
  isRoleExist,
  isAllowedToManipulate,
};
