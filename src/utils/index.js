const nodemailer = require("nodemailer");
const { authBaseURI, activateAccountURI } = require("../config/paths.config");

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

async function sendAccountActivationEmail(email, uniqueString, apiHostDomain) {
  // on production env get this kind of config
  // const transport = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'may@gmail.com',
  //     pass: 'myPassWord',
  //   },
  // });

  const transport = nodemailer.createTransport({
    service: "mailhog",
    port: 1025,
  });

  const sender = "MiniBlog My Company <info@mini-blog.org>";
  const mailOptions = {
    from: sender,
    to: email,
    subject: "Email confirmation",
    html: `Press <a href='http://${apiHostDomain}${authBaseURI}${activateAccountURI}/${uniqueString}'>Here</a> to verify your email.`,
  };

  transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent");
    }
  });
}

module.exports = {
  isUserAuthorizedToModifyResource: isUserAuthorizedToModifyResource,
  randomStringGenerator: randomStringGenerator,
  sendAccountActivationEmail: sendAccountActivationEmail,
};
