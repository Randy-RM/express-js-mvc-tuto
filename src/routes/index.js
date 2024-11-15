const { Router } = require("express");

const {
  articleBaseURI,
  authBaseURI,
  userBaseURI,
} = require("../config/paths.config");

const router = Router();

router.use(authBaseURI, require("./auth.routes.js"));
router.use(userBaseURI, require("./users.routes.js"));
router.use(articleBaseURI, require("./articles.routes.js"));

module.exports = router;
