const express = require('express')
const router = express.Router()
const UserController = require('../app/controller/UserController')
router.get('/',UserController.home)
router.get("/:slug", UserController.showPage);
module.exports = router