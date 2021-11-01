const express = require('express');
const app = express();
const chalk = require('chalk');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('./routes/user.router');
const entrainementRouter = require('./routes/entrainement.route');
//database
// const {MongoClient} = require('mongodb');
// const mongoose = require('mongoose');
// const User = require('./models/user');

//database mysql
const sequelize = require('./config/mysql');

// Database mysql model's
const Sportif = require('./models/sportif');
const Agenda = require('./models/agenda');
const Entrainement = require('./models/entrainement');
const Perfomance = require('./models/perfomance');
const SportifEntrainement = require('./models/sportifEntrainement');


const { DataTypes } = require('sequelize');
//dotenv
require('dotenv').config();

//router here


app.use(cors());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(session({secret: 'keyboard cat',
resave: true,
saveUninitialized: true,
cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }}));

global.__basedir = __dirname;


app.use('/user', userRouter);
app.use('/entrainement', entrainementRouter)

app.listen(process.env.PORT, async () =>{

    try {

       
        //création des associations
        


        Sportif.belongsToMany(Entrainement,{through : SportifEntrainement, onDelete:'CASCADE', onUpdate:'CASCADE', foreignKey:{
            name:'sportif_id'
        }});
        Entrainement.belongsToMany(Sportif, {through: SportifEntrainement, onDelete:'CASCADE', onUpdate:'CASCADE' , foreignKey: {name:'entrainement_id'}});

  

        await sequelize.authenticate();
        
        // await Sportif.sync({alter:true})
        // await Agenda.sync({alter:true})
        // await Entrainement.sync({alter:true})
        
        // await Perfomance.sync({alter:true})
        // await SportifEntrainement.sync({alter:true})
        
   
    
        console.log(`Example app listening at http://localhost:${process.env.PORT}`)
    }
    catch(error){
        console.error('unable to connect the database', error);
    }
    
})

// mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
//     .then(() =>{
//         app.use('/user', userRouter);

//         app.listen(process.env.PORT,   () => {
//             console.log(`Example app listening at http://localhost:${process.env.PORT}`)
//           })
           
//     })




