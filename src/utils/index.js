const nodemailer = require("nodemailer");
const { RoleModel } = require("../models/index.js");
const { authBaseURI, activateAccountURI } = require("../config/paths.config");
const { ROLES } = require("../constant");

async function getRoles() {
  try {
    const roles = await RoleModel.find().select("roleName");
    const rolesNames = roles.map(({ roleName }) => roleName);
    const userRoles = Object.fromEntries(
      rolesNames.map((role) => [role, role])
    );
    return userRoles;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function isRoleExist(role) {
  return [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER].includes(role);
}

function isAllowedToManipulate(resourceOwnerId, connectedUser) {
  const { id: loggedUserId, role: loggedUserRole } = connectedUser;
  if (resourceOwnerId != loggedUserId) {
    if (loggedUserRole != ROLES.ADMIN) {
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

async function sendAccountActivationEmail(email, uniqueString, apiHostDomain) {
  let transport;
  if (process.env.NODE_ENV === "development") {
    transport = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE,
      port: 1025,
    });
  } else {
    // on production env get this kind of config
    transport = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }

  const sender = "MiniBlog My Company <info@mini-blog.org>";
  const mailOptions = {
    from: sender,
    to: email,
    subject: "Email confirmation",
    html: `Press <a href='http://${apiHostDomain}${authBaseURI}${activateAccountURI}/${uniqueString}'>Here</a> to verify your email.`,
  };

  transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log("Confirmation email not sent");
      console.log(error);
    } else {
      console.log("Confirmation email sent");
    }
  });
}

module.exports = {
  getRoles: getRoles,
  isRoleExist: isRoleExist,
  isAllowedToManipulate: isAllowedToManipulate,
  randomStringGenerator: randomStringGenerator,
  sendAccountActivationEmail: sendAccountActivationEmail,
};
