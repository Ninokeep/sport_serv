const {MongoClient} = require("mongodb");
const chalk = require('chalk');
const connectionString = process.env.MONGO_URI;

const client = new MongoClient(connectionString,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

let dbConnection;

module.exports = {
    connectToServer: function(callback){
        client.connect(function(err,db){
            if(err || !db){
                return callback(err)
            }
            dbConnection = db.db("app_running");
            console.log(chalk.bgGreen("connexion à mongo réussie !"))
            return callback();
        })
    },
    getDb: function(){
        return dbConnection;
    }
}
