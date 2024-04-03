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

function randomStringGenerator() {
  // considering a 8 length string
  const stringLength = 8;
  let randomString = "";
  for (let i = 0; i < stringLength; i++) {
    randomString += Math.floor(Math.random() * 10 + 1);
  }
  return randomString;
}

module.exports = {
  isUserAuthorizedToModifyResource: isUserAuthorizedToModifyResource,
  randomStringGenerator: randomStringGenerator,
};
