const { Router } = require("express");

const {
  articleBaseURI,
  authBaseURI,
  roleBaseURI,
  userBaseURI,
} = require("../config/paths.config");

const router = Router();

router.use(authBaseURI, require("./auth.routes.js"));
router.use(roleBaseURI, require("./roles.routes.js"));
router.use(userBaseURI, require("./users.routes.js"));
router.use(articleBaseURI, require("./articles.routes.js"));

module.exports = router;
