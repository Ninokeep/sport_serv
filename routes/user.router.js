const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {check} = require('express-validator');
const authenticateToken = require('../middlewares/authenticateJWT');


router.post('/login',check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('email').trim().notEmpty().isEmail().toLowerCase().withMessage('mauvais format d email'), userController.login)

router.post('/create',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
// check('sport').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('la discipline peut pas être vide'),
check('poids').trim().isNumeric().notEmpty().withMessage('le poids peut pas être vide'),
check('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),


userController.register);
router.post('/logout',check('email').trim().notEmpty().isEmail().withMessage('mauvais format d email')
,[authenticateToken],userController.logout)


router.put('/update',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
check('sport').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('la discipline peut pas être vide'),
check('poids').trim().isNumeric().notEmpty().withMessage('le poids peut pas être vide'),
check('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),



[authenticateToken],userController.update);


//test token ici
router.get('/token',userController.test)

router.post('/sport',
check('sport').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le champ sport ne peut pas être vide'),
[authenticateToken], userController.checkSport)
router.post('/objectif',
check('objectif').trim().notEmpty().toLowerCase().withMessage('le champ objectif ne peut pas être vide'),
[authenticateToken], userController.objectifSport)




// entrainement
router.post('/suivre/entrainement', userController.suivreEntrainement);
router.post('/quitter/entrainement', userController.quitterEntrainement);






router.get('/:id', [authenticateToken], userController.getUser)



module.exports = router;
