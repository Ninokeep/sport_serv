const  {Sequelize} = require('sequelize');




const sequelize = new Sequelize('app_running', 'root','password', {
    host: 'localhost', //change to my_db for container
    dialect: 'mysql',
    port:'3306',
    define: { engine: 'INNOBDB' }
});

module.exports = sequelize;