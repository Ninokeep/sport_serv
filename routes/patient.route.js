const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const {check} = require('express-validator');
const authenticateToken = require('../middlewares/authenticateJWT');
const kineController = require('../controllers/kine.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - nom
 *         - prenom
 *         - sexe
 *         - email
 *         - password
 *         - age
 *         - pathologie
 *         - seance_restante
 *         - id_kine
 *       properties:
 *         id:
 *           type: string
 *           description: l'id est auto généré.
 *         nom:
 *           type: string
 *           description: le nom de l'utilisateur.
 *         prenom:
 *           type: string
 *           description: Le prénom de l'utilisateur.
 *         sexe:
 *           type: boolean
 *           description:  0 = femme et 1 = femme.
 *         email:
 *           type: string
 *           description: l'email de l'utilisateur.
 *         password:
 *           type: string
 *           description: le mot de passe doit être supérieure à 8 caractères.
 *         age :
 *           type: integer
 *           description: l'âge du patient.
 *         pathologie:
 *           type: string
 *           description: la pathologie du patient.
 *         seance_restante:
 *           type: integer
 *           description: le nombre restante de séance du patient
 *         id_kine:
 *           type: integer
 *           description: l'id du kiné qui prend en charge le patient.
 *       example:
 *         id: 1
 *         nom: jean
 *         prenom: dujardin
 *         sexe : 1
 *         email : fa@gmail.com
 *         password: 12345678
 *         age : 27
 *         pathologie : tendinite jambe droite
 *         seance_restante : 5
 *         id_kine: 27
 *         
 */

 /**
  * @swagger
  * tags:
  *   name: User
  *   description: The user managing API
  */

/**
 * @swagger
 * /kine/patients:
 *   post:
 *     summary: Returns the list of all the users
 *     tags: [User]
 * 
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * 
 */


router.post('/patients', [authenticateToken], patientController.patients)

router.post('/logout',check('email').trim().notEmpty().isEmail().withMessage('mauvais format d email')
 ,[authenticateToken],kineController.logout)

 router.post('/login',check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
 check('email').trim().notEmpty().isEmail().toLowerCase().withMessage('mauvais format d email'), kineController.login)


 



// get all patients
router.post('/create',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
check('age').trim().isNumeric().notEmpty().withMessage("l'age peut pas être vide"),
check('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),
check('pathologie').trim().not().isNumeric().notEmpty().withMessage("la pathologie ne peut pas être vide"),
check("numero_telephone").trim().isMobilePhone('fr-BE').notEmpty().withMessage("le numéro de téléphone ne peut pas être vide"),
check("seance_restante").trim().isNumeric().notEmpty().withMessage("le nombre de séance ne peut pas être vide"),
check("id_kine").trim().isNumeric().notEmpty().withMessage("l'id du kiné de séance ne peut pas être vide"), patientController.create)





module.exports = router