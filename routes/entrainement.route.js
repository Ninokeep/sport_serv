const express = require('express');
const router = express.Router();
const entrainementController = require('../controllers/entrainement.controller');
const {check} = require('express-validator');
const isEntraineur = require('../middlewares/isEntraineur');
const isAuthenticate = require('../middlewares/authenticateJWT');

router.post('/create', [isAuthenticate,isEntraineur], entrainementController.create);
router.get('/' , entrainementController.allEntrainement);




module.exports = router;
