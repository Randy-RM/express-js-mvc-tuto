function isUserAuthorizedToModifyResource({
  userIdInResource,
  logedUserId,
  logedUserRoleName,
}) {
  if (userIdInResource != logedUserId) {
    if (logedUserRoleName != "admin") {
      return false;
    }
  }
  return true;
}

module.exports = {
  isUserAuthorizedToModifyResource: isUserAuthorizedToModifyResource,
};
