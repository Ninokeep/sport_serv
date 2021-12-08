const  {Sequelize} = require('sequelize');




const sequelize = new Sequelize('ia_sport', 'root','password', {
    host: 'localhost', //change to my_db for container
    dialect: 'mysql',
    port:'3306',
    define: { engine: 'INNOBDB' }
});

module.exports = sequelize;