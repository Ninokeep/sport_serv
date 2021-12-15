const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const patientRouter = require('./routes/patient.route');
const kineRouter = require('./routes/kine.route');





//database mysql
const sequelize = require('./config/mysql');

// Database mysql model's
const Kine = require('./models/kine');



const { DataTypes } = require('sequelize');
//dotenv
require('dotenv').config();

// je délcare yml ici
// swagger right here 
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require("swagger-jsdoc");
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// const options = {
// 	definition: {
// 		openapi: "3.0.0",
// 		info: {
// 			title: "TFE API DOCUMENTATION",
// 			version: "1.0.0",
// 			description: "Api in express",
// 		},
// 		servers: [
// 			{
// 				url: "http://localhost:8001",
// 			},
// 		],
// 	},
// 	// apis: ["./routes/*.js"],
// };
// const specs = swaggerJSDoc(options)
const options = {
    explorer : true
}

//router here
app.use(
  '/api-docs',
  swaggerUi.serve, swaggerUi.setup(swaggerDocument, options)
);

app.use(cors());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(session({secret: 'keyboard cat',
resave: true,
saveUninitialized: true,
cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }}));

global.__basedir = __dirname;


app.use('/kine', kineRouter)



if(!module.parent){

    app.listen(8001, async () =>{

        try {
            await sequelize.authenticate();
            // await Kine.sync({alter:true})
            // await Sportif.sync({alter:true})
            // await Agenda.sync({alter:true})
            // await Entrainement.sync({alter:true})
            // await Perfomance.sync({alter:true})
            // await SportifEntrainement.sync({alter:true})
            console.log(`Example app listening at http://localhost:8001`)
        }
        catch(error){
            console.error('unable to connect the database', error);
        }
        
    })
    
}



module.exports = app;




