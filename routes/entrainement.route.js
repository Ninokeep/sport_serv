const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const isEntraineur = require('../middlewares/isEntraineur');
const isAuthenticate = require('../middlewares/authenticateJWT');





module.exports = router;
