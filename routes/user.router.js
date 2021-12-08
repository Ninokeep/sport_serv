const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {check} = require('express-validator');
const authenticateToken = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

 /**
  * @swagger
  * tags:
  *   name: Books
  *   description: The books managing API
  */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */













router.post('/login',check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('email').trim().notEmpty().isEmail().toLowerCase().withMessage('mauvais format d email'), userController.login)

router.post('/create',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
check('age').trim().isNumeric().notEmpty().withMessage("l'age peut pas être vide"),
check('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),
check('pathologie').trim().not().isNumeric().notEmpty().withMessage("la pathologie ne peut pas être vide"),
check("numero_telephone").trim().isString().notEmpty().withMessage("le numéro de téléphone ne peut pas être vide"),
check("seance_restante").trim().isNumeric().notEmpty().withMessage("le nombre de séance ne peut pas être vide"),
check("id_kine").trim().isNumeric().notEmpty().withMessage("l'id du kiné de séance ne peut pas être vide"),

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




// entrainement pour les utilisateurs à sécuriser les routes
router.post('/suivre/entrainement',[authenticateToken] ,userController.suivreEntrainement);
router.post('/quitter/entrainement',[authenticateToken], userController.quitterEntrainement);
router.post('/entrainement', userController.getEntrainementByUser);
router.post('/fini/entrainement',userController.getEntrainementFinishedByUser);





router.get('/:id', [authenticateToken], userController.getUser)



module.exports = router;
